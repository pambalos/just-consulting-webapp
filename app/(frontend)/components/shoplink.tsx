"use client";

import {NavLink} from "react-bootstrap";

export default function ShopLink({session}: { session: any | null }) {
    return (
        <NavLink id={"shop-link"} href="/shop/services">
            Shop
        </NavLink>
    )

    // if (session?.user) {
    //     return (
    //         <NavLink id={"shop-link"} href="/shop">
    //             Shop
    //         </NavLink>
    //     )
    // } else {
    //     return (
    //         <></>
    //     )
    // }
}