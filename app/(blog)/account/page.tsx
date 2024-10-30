"use client";

import {useSession} from "next-auth/react";
import {getServerSession} from "next-auth";
// set to client

function AccountPage() {
    const {data: session, status} = useSession();

    if (session !== null) {
        return (
            <div>
                <h1>Session Details</h1>
                <h3>This is for OAuth Demo purposes</h3>
                <p>Status: {status}</p>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Session Details</h1>
                <p>Status: {status}</p>
                <p>No session found</p>
            </div>
        )
    }
}

export default AccountPage;