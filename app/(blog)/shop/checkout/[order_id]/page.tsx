"use client";

import {useParams} from 'next/navigation';
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {CustomSession} from "@/app/customTypes";
import {Button} from "react-bootstrap";
import {LoadingOverlay} from "@achmadk/react-loading-overlay";
import Image from "next/image";

import squareLogo from "../../../../square_logo.png"

export default function CheckoutPage() {
    //get order_id from path params
    const order_id = useParams().order_id;
    const [orderData, setOrderData] = useState(null)
    const [isActive, setIsActive] = useState(false)
    //get session data
    // @ts-ignore
    const {data: session, status} : {data: CustomSession, status: string | null} = useSession();

    function handlePayWithStripe(link: string) {
        // open loading modal, in new page, redirect to square payment link
        setIsActive(true)
        // wait for payment to be completed
        window.open(link, "_self")
    }

    useEffect(() => {
        async function fetchCheckoutDetails() {
            const response = await fetch("/api/checkout/" + order_id, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                return await response.json()
            }
        }

        fetchCheckoutDetails().then(d => setOrderData(d))

    }, [order_id])

    //redirect to login if session is null
    return (
        <LoadingOverlay active={isActive} spinner text={'Redirecting to Square for payment'}>
            <div className={"order-page"}>
                <div className={"order-page-header"}>
                    <h1>Checkout</h1>
                </div>
            {
                session && orderData ? (
                    <div className={"order-panel"}>
                        <h5>Order Details</h5>
                        <div className={"order-details-panel"}>
                            {
                                // @ts-ignore
                                orderData.order.line_items.map((item, index) => {
                                    let currency = item.base_price_money.currency
                                    let currencySymbol = currency === "USD" ? "$" : currency
                                    return (
                                        <div key={index} className={"order-li-panel"}>
                                            <div className={"order-li-header"}>
                                                <p className={"oli-title"}>{item.name}</p>
                                            </div>
                                            <div className={"order-li-details "}>
                                                <div className={"lid-left "}>
                                                    {item.variation_name}: x{item.quantity}
                                                    {/*<p className={"oli-name"}></p>*/}
                                                    {/*<p className={"oli-quantity"}></p>*/}
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
                        <div className={"order-total-panel"}>
                            <p>Total: &nbsp;</p>
                            {/* @ts-ignore */}
                            <p>{orderData.order.total_money.currency === "USD" ? "$" : orderData.order.total_money.currency}{orderData.order.total_money.amount/100}</p>
                        </div>
                        <div className={"order-payment-panel"}>
                            {/* @ts-ignore */}
                            {
                                // @ts-ignore
                                orderData.order_details && (
                                    // @ts-ignore
                                    <Button variant={"primary"} onClick={() => handlePayWithStripe(orderData.order_details.payment_link)}>
                                        Pay Now
                                        <Image style={{display: "unset"}} width={60} height={60} src={squareLogo} alt={"square-logo"}/>
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Fetching details...</p>
                    </div>
                )
            }
        </div>
        </LoadingOverlay>
    )
}