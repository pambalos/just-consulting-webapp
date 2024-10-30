
"use client";

import {signIn, signOut, useSession} from "next-auth/react";
import {NavLink} from "react-bootstrap";

export default function UserLogButton({session}: { session: any | null }) {
    if (session?.token?.role) {
        return (
            <NavLink onClick={() => signOut()}>
                Sign out
            </NavLink>
        )
    }
    return (
        <NavLink onClick={() => signIn()}>
            Sign in
        </NavLink>
    )
}