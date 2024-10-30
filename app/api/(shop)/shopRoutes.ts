import {CartItem, CustomSession, Order, ProfileDataResponse} from "@/app/customTypes";
import {getServerSession} from "next-auth";
import {AuthOptions} from "@/app/auth";
import {SquareHeaders} from "@/app/utils";
import {sql} from "@vercel/postgres";
import {createClient} from "@vercel/kv";


const kv = createClient({
    token: process.env.KV_REST_API_TOKEN,
    url: process.env.KV_REST_API_URL
})

export async function checkoutPOST(request: Request) {
    const session : CustomSession | null = await getServerSession(AuthOptions)
    if (!session) {
        return new Response("Unauthorized", {status: 401})
    }

    //TODO: delete old draft orders
    const cart : {cart: CartItem[]} = await request.json()
    console.log("POST Checkout Cart", cart)

    const squareOrder = {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: Array.from(cart.cart).map(item => {
            return {
                name: item.service_title,
                variation_name: item.title,
                note: item.service_title + ", " + item.title + ": " + item.service_id,
                quantity: item.quantity.toString(),
                base_price_money: {
                    // TODO: convert to cents
                    amount: item.price,
                    currency: "USD"
                }
            }
        })
    }
    console.log("POST Checkout Square Order", JSON.stringify({"order":squareOrder}))

    const checkout_url = process.env.SQUARE_BASE_URL + "/v2/online-checkout/payment-links"
    const checkout_body = JSON.stringify({
        order: squareOrder,
        checkout_options: {
            redirect_url: process.env.NEXTAUTH_URL + "/shop/checkout/confirmation",
            accepted_payment_methods: {
                apple_pay: true,
                google_pay: true,
                cash_app_pay: true,
                afterpay_clearpay: true,
            }
        }
    });

    console.log("POST Checkout Square Payment Link", checkout_body)
    const checkout_response = await fetch(checkout_url, {
        method: "POST",
        headers: SquareHeaders(),
        body: checkout_body
    })

    if (checkout_response.ok) {
        const checkout_resp = await checkout_response.json()
        console.log("POST Checkout Square Payment Link Response", checkout_resp)
        const order_id = checkout_resp.payment_link.order_id
        // Save order details to the database
        try {
            await sql`INSERT INTO orders (user_id, order_id, status, total_cost_cents, payment_link, currency, created_at) 
                VALUES (${session.token.sub}, 
                        ${checkout_resp.payment_link.order_id}, 
                        ${checkout_resp.related_resources.orders[0].state}, 
                        ${checkout_resp.related_resources.orders[0].total_money.amount}, 
                        ${checkout_resp.payment_link.url},
                        ${checkout_resp.related_resources.orders[0].total_money.currency},
                        ${new Date().toISOString()})`
        } catch (e) {
            console.error("POST Checkout Square Payment Link Failed to save order details to db", e)
        }

        //extract line items from order to insert into db
        const line_items = checkout_resp.related_resources.orders[0].line_items.map((item: any) => {
            return [
                order_id,
                item.name,
                item.variation_name,
                Number(item.quantity),
                item.base_price_money.amount,
                item.base_price_money.currency,
                item.note
            ]
        })
        console.log("POST Checkout Square Payment Link Line Items for DB", line_items)
        try {
            for (const item of line_items) {
                await sql`INSERT INTO order_line_items (order_id, name, variation_name, quantity, base_price_cents, currency, note) VALUES (${item[0]}, ${item[1]}, ${item[2]}, ${item[3]}, ${item[4]}, ${item[5]}, ${item[6]})`
            }
        } catch (e) {
            console.error("POST Checkout Square Payment Link Failed to save order line items to db", e)
        }

        return new Response(JSON.stringify({order_id: order_id}), {status: 200})
    } else {
        console.log("POST Checkout Square Payment Link Failed", checkout_response)
    }
    return new Response("Failed", {status: 500})
}

export async function checkoutOrderIdGET(request: Request) {
    const session : CustomSession | null = await getServerSession(AuthOptions)
    if (!session) {
        return new Response("Unauthorized", {status: 401})
    }
    // get the order id from request
    const order_id = request.url.split("/").pop()
    console.log("GET Checkout Order ID", order_id)

    // check that the order id belongs to the user
    const orderResponse = await sql`SELECT * FROM orders WHERE order_id = ${order_id} AND user_id = ${session.token.sub}`

    const orderDetailsResponse = await fetch(process.env.SQUARE_BASE_URL + "/v2/orders/" + order_id, {
        method: "GET",
        headers: SquareHeaders()
    })
    if (orderDetailsResponse.ok) {
        const orderDetails = await orderDetailsResponse.json()
        console.log("GET Checkout Order Details", orderDetails)
        // @ts-ignore
        console.log("GET Checkout Order Response", orderResponse.rows[0])
        return new Response(JSON.stringify({...orderDetails, order_details: orderResponse.rows[0]},), {status: 200})
    } else {
        return new Response("Not Found", {status: 404})
    }
}

export async function checkoutConfirmationOrderIdGET(request: Request) {
    const session : CustomSession | null = await getServerSession(AuthOptions)
    if (!session) {
        return new Response("Unauthorized", {status: 401})
    }
    // get the order id from request
    const order_id = request.url.split("/").pop()
    console.log("GET Checkout Order ID", order_id)

    // fetch order details from square
    const orderDetailsResponse = await fetch(process.env.SQUARE_BASE_URL + "/v2/orders/" + order_id, {
        method: "GET",
        headers: SquareHeaders()
    })
    if (orderDetailsResponse.ok) {
        const orderDetails = await orderDetailsResponse.json()
        console.log("GET Checkout Order Details", orderDetails)

        // update order status in the database
        try {
            await sql`UPDATE orders SET status = ${orderDetails.order.state} WHERE order_id = ${order_id}`
            return new Response(JSON.stringify({...orderDetails}), {status: 200})
        } catch (e) {
            return new Response(JSON.stringify({error: e}), {status: 500})
        }
    } else {
        return new Response("Not Found", {status: 404})
    }
}


export async function cartGET(request: Request) {
    const session : CustomSession | null = await getServerSession(AuthOptions)
    if (!session) {
        return new Response("Unauthorized", {status: 401})
    }
    // fetch from KV
    const cart : {cart: CartItem[]} | null = await kv.get(session.token.user_id + "_cart")
    console.log("GET Cart, fetched", cart)

    if (!cart) {
        console.log("GET Cart, empty")
        return new Response(JSON.stringify({"cart": []}), {status: 200})
    }
    return new Response(JSON.stringify(cart), {status: 200})
}

export async function cartPOST(request: Request) {
    const session : CustomSession | null = await getServerSession(AuthOptions)
    if (!session) {
        return new Response("Unauthorized", {status: 401})
    }
    try {
        const cart : CartItem[] = await request.json()
        console.log("POST Cart", cart)
        await kv.set(session.token.user_id + "_cart", cart)
        return new Response(JSON.stringify(cart), {status: 200})
    } catch (e) {
        console.error("POST Cart Error: ", e)
        return new Response("Error", {status: 500})
    }
}

export async function profileGET(request: Request) {
    const session : CustomSession | null = await getServerSession(AuthOptions)
    if (!session) {
        return new Response("Unauthorized", {status: 401})
    }
    const userResponse = await sql`SELECT * FROM user_account WHERE id = ${session.token.sub}`
    if (userResponse.rows.length === 0) {
        return new Response("Not Found", {status: 404})
    }

    const ordersResponse =
        await sql`SELECT * FROM orders 
         WHERE status != 'DRAFT' 
           AND user_id = ${session.token.sub}
           ORDER BY created_at DESC`

    const orderIds = ordersResponse.rows.map((order: any) => order.order_id)

    const lineItemsMap = new Map()
    for (const id of orderIds) {
        const lineItems = await sql`SELECT * FROM order_line_items WHERE order_id = ${id}`
        lineItemsMap.set(id, lineItems.rows)
    }

    const data: ProfileDataResponse = {
        user: {
            email: userResponse.rows[0].email,
            id: userResponse.rows[0].id,
            image: userResponse.rows[0].image,
            name: userResponse.rows[0].name,
            role: userResponse.rows[0].role
        },
        orders: ordersResponse.rows.map((order: any) : Order => {
            return {
                created_at: order.created_at,
                currency: order.currency,
                order_id: order.order_id,
                status: order.status,
                total_cost_cents: order.total_cost_cents,
                line_items: lineItemsMap.get(order.order_id) || []
            }
        })
    }

    return new Response(JSON.stringify(data), {status: 200})
}