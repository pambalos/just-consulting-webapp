
"use client";

import {NavLink} from "react-bootstrap";

export default function StudioLink({session}: { session: any | null }) {
    // @ts-ignore
    if (session?.token.role === "admin") {
        return (
            <NavLink href={"/studio"}>
                Studio
            </NavLink>
        )
    }
    return (
        <></>
    )
}