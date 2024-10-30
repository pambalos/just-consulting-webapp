"use client";

import { createContext, useContext, useState } from "react";
import { CartItem } from "@/app/customTypes";

export const CartContext = createContext<{
    cart: CartItem[] | undefined;
    setCart: (cart: CartItem[]) => void;
}>({
    cart: [],
    setCart: () => null,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>();
    const value = { cart, setCart };
    return (
        // @ts-ignore
        <CartContext.Provider value={value} >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
}