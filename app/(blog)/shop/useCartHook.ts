"use client";

import {useState} from "react";

export function useCartHook() {
    const [cart, setCart] = useState([]);
    return {cart, setCart};
}