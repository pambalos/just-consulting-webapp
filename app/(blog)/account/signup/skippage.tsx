"use client";

import {useSession} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import {useState} from "react";

const signUp = async (email: string, name: string) => {

    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, name})
    });
    if (response.ok) {
        window.location.href = "/account";
    }
}

export default function SignUpPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")?.toString() || ""
    const name = searchParams.get("name")?.toString() || ""

    return (
        <div>
            <h1>Sign Up</h1>
            <p>Sign up for an account here</p>
            <form onSubmit={() => signUp(email, name)}>
                <label>Email</label> &nbsp;
                <label id="email">{email}</label>
                <br></br>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}