"use client";

import {useSession} from "next-auth/react";
import {CartItem} from "@/app/customTypes";
import React, {useState} from "react";
import Cart from "@/app/(blog)/shop/cart";
import {CartProvider} from "@/app/(blog)/shop/cartProvider";

export default function ShopLayout({
     children,
 }: {
    children: React.ReactNode;
}) {
    // const {data: session} = useSession();
    // const [cart, setCart] = useState<CartItem[]>([]);

    return (
        <div className={"shop-layout"}>
            <CartProvider>
            <Cart/>
            {
                children
            }
            </CartProvider>
        </div>
    )
}