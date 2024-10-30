export interface CartItem {
    price: number,
    pricing_model: string,
    quantity: number,
    service_title: string,
    service_id: string,
    title: string,
    _id: string
    _createdAt: string
    _updatedAt: string
    _rev: string
    _type: string
}

export interface CustomSession {
    user: {
        name: string,
        email: string,
        image: string
    },
    token: {
        name: string,
        email: string,
        picture: string,
        sub: string,
        role: string,
        user_id: string,
        iat: number,
        exp: number,
        jti: string,
    }
}

export interface Service {
    _id: string
    _type: string
    title: string
    description: string
    price: number
    image: {
        asset: {
            url: string
        }
    }
    images: [
        any
    ]
}

export interface User {
    email: string,
    id: string,
    image: string,
    name: string,
    readonly role: string
}

export interface Order {
    created_at: string,
    currency: string,
    order_id: string,
    status: string,
    total_cost_cents: number
    line_items: any[]
}

export interface ProfileDataResponse {
    user: User,
    orders: Order[]
}