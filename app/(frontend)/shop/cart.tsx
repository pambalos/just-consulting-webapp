"use client";

import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import {useEffect, useState} from "react";
import {CartItem, CustomSession} from "@/app/customTypes";
import {useSession} from "next-auth/react";
import {Button} from "react-bootstrap";
import { ShoppingCart } from 'lucide-react';
import {useCart} from "@/app/(frontend)/shop/cartProvider";

async function saveCart(cart: CartItem[]) {
    const cartJson = {
        "cart": cart
    };
    try {
        await fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartJson)
        })
    } catch (error) {
        console.error("KV Error: ", error);
    }
    return void 0;
}

async function checkout(cart: CartItem[] | undefined, session: CustomSession | null) {
    if (cart?.length === 0) {
        alert("Cart is empty");
        return;
    }
    if (!session) {
        alert("You must be logged in to checkout");
        return;
    }
    try {
        const checkout_resp = await fetch("/api/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"cart":cart})
        });

        if (checkout_resp.ok) {
            const checkout_data = await checkout_resp.json();
            // redirect to checkout page
            window.location.href = "/shop/checkout/" + checkout_data.order_id;
        } else {
            alert("Checkout failed");
        }

    } catch (error) {
        console.error("Checkout Error: ", error);
        alert("Checkout failed");
    }
    return void 0;
}

export default function Cart() {
    const {cart, setCart} = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    const [cartDisplayed, setCartDisplayed] = useState(false);

    // @ts-ignore
    const {data: session} : {data: CustomSession | null} = useSession();
    const handleClose = () => {
        setCartOpen(false)
        setCartDisplayed(false)
    };
    const handleShow = () => {
        setCartOpen(true)
        // wait 500ms then set cart to displayed
        setTimeout(() => {
            setCartDisplayed(true)
        }, 200);
    };

    useEffect(() => {
        //set 'shop-link' active
        document.getElementById("shop-link")?.classList.add("active");

        async function getCart() {
            const cart_response = await fetch("/api/cart");
            return await cart_response.json()
        }

        getCart().then(
            (cartJson) => {
                setCart(cartJson.cart);
            }
        )
    }, [setCart]);

    return(
    <>
        {
            session &&
            (
                <>
                    <Button variant={"outline-light"}>
                        <ShoppingCart onClick={handleShow} color={"gray"}/>
                    </Button>
                    <Navbar.Offcanvas
                        show={cartOpen}
                        onHide={handleClose}
                        placement="end">
                        <Offcanvas.Header className={"cart-open-button"} closeLabel={"cart-toggled"} closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                                Shopping Cart
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body id={"cart-offcanvas"}>
                            <div className={"cart-navbar-list hidden-cart"}
                                 style={
                                     {
                                         display: (cartDisplayed ? "block" : "none")
                                     }
                                 }
                            >
                                {
                                    cart && Array.from(cart).map((product) => {
                                        return (
                                            <div className={"cart-panel-wrapper"} key={product._id + "-cart-panel"}>
                                                <div className={"cart-panel"}>
                                                    <h4 className={"cart-name-header"}>{product.service_title}</h4>
                                                    <h5>{product.title}</h5>
                                                    <p>${product.price / 100} : <button onClick={() => {
                                                        let found = cart.find((prd) => prd._id === product._id);
                                                        if (found) {
                                                            if (found.quantity > 1) {
                                                                found.quantity -= 1;
                                                                setCart([...cart]);
                                                                saveCart(cart);
                                                            } else {
                                                                let updatedCart = cart.filter((prd) => prd._id !== product._id);
                                                                setCart(updatedCart);
                                                                saveCart(updatedCart);
                                                            }
                                                        }
                                                    }}>-</button> {product.quantity}x <button onClick={() => {
                                                        let found = cart.find((prd) => prd._id === product._id);
                                                        if (found) {
                                                            found.quantity += 1;
                                                            setCart([...cart]);
                                                            saveCart(cart);
                                                        }
                                                    }}>+</button></p>

                                                    <p className={"right-0"}>${(product.quantity * product.price) / 100}</p>
                                                </div>
                                                <hr/>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className={"cart-navbar-footer"}>
                                {cart && cart.length === 0 ?
                                    <>
                                        <h6>Your cart is empty</h6>
                                    </>
                                    :
                                    <>
                                        <button type="button" style={{
                                            display: (cartDisplayed ? "block" : "none")
                                        }} className="btn btn-success" onClick={() => checkout(cart, session)}>Checkout
                                        </button>
                                        {/*<p>Total: ${*/}
                                        {/*    cart.reduce((tot, product) => {*/}
                                        {/*        return tot + (product.price * product.quantity)/100;*/}
                                        {/*    }, 0)*/}
                                        {/*}</p>*/}
                                    </>
                                }
                            </div>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </>
            )
        }

    </>
    )
}