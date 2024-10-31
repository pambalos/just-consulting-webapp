"use client"

import {useParams, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";


export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get("transactionId")
    const orderId = searchParams.get("orderId")
    const [orderDetails, setOrderDetails] = useState()

    useEffect(() => {
        async function getConfirmationDetails() {
            const resp = await fetch("/api/checkout/confirmation/" + orderId)
            if (resp.ok) {
                const respBody = await resp.json()
                return respBody
            }
        }

        getConfirmationDetails().then(d => setOrderDetails(d))
    }, [orderId])

    return (
        <div className={"confirmation-page order-page"}>
            <div className={"confirmation-header order-page-header"}>
                <h1>Confirmation Page</h1>
                <div className={"order-id-header"}>
                    <h5>OrderID:</h5> &nbsp;
                    <p>{orderId}</p>
                </div>
            </div>
            <div className={"confirmation-panel order-panel"}>
                <div className={"confirmation-details order-details-panel"}>
                    {
                        // @ts-ignore
                        orderDetails && orderDetails.order.line_items.map((item, index) => {
                            let currency = item.base_price_money.currency
                            let currencySymbol = currency === "USD" ? "$" : currency
                            return (
                                <div key={index} className={"order-li-panel"}>
                                    <div className={"order-li-header"}>
                                        <p className={"oli-title"}>{item.name}</p>
                                    </div>
                                    <div className={"order-li-details"}>
                                        <div className={"lid-left "}>
                                            {item.variation_name}: x{item.quantity}
                                        </div>
                                        <div className={"dots"}></div>
                                        <div className={"lid-right "}>
                                            <p className={"oli-total"}>{currencySymbol}{item.base_price_money.amount/100}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}