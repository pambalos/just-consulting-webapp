import {sanityFetch} from "@/sanity/lib/fetch";
import {sanityCreate} from "@/sanity/lib/userdao";
import {sql} from "@vercel/postgres";
import {NextAuthOptions} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


async function sanitySignInAuthFlow({user, account} : {user: any, account: any}) {
    const sanityUser = await sanityFetch({query: `*[_type == 'user' && id == '${user.id}']`, immediate: true})
    if (sanityUser.length === 0) {
        try {
            const newUser = {...user, _type: 'user', role: 'user', _id: user.id}
            await sanityCreate({document: {...user, _type: 'user', role: 'user'}})
        } catch (error) {
            console.error("Error saving user to sanity", error)
            return false
        }
        if (process.env.SAVE_ACCOUNT_TO_SANITY === 'true') {
            try {
                const existingAccount = await sanityFetch({query: `*[_type == 'account' && providerAccountId == '${account.id}']`, immediate: true})
                if (existingAccount.length > 0) {
                    const updatedAccount = {...existingAccount[0], _id: existingAccount[0]._id}
                    try {
                        await sanityCreate({document: updatedAccount})
                    } catch (error) {
                        console.error("Error updating account in sanity", error)
                        return false
                    }
                }
                await sanityCreate({document: {...account, _type: 'account'}})
            } catch (error) {
                console.error("Error saving account to sanity", error)
                return false
            }
            return true
        }
    }
    return true
}

async function jwtFlow({token} : {token: any}) {
    if (process.env.AUTH_MODE === 'database') {
        return await jwtDatabaseFlow({token})
    } else if (process.env.AUTH_MODE === 'sanity') {
        return await jwtSanityFlow({token})
    } else {
        console.error("Invalid AUTH_MODE", process.env.AUTH_MODE)
        return {}
    }
}

async function jwtDatabaseFlow({token} : {token: any}) {
    if (!token.role) {
        const { rows, fields} = await sql`SELECT * FROM user_account WHERE email = ${token.email}`
        if (rows.length === 0) {
            return {}
        }
        token = {...token, role: rows[0]['role'], user_id: rows[0]['id']}
        return token
    }
    return token
}

async function jwtSanityFlow({token} : {token: any}) {
    if (!token.role) {
        let sanityUser = await sanityFetch({query: `*[_type == 'user' && id == '${token.sub? token.sub : token.id}']`, immediate: true})
        let attempts = 0
        let wait = 1000
        while (sanityUser.length === 0 && attempts <= 10) {
            await new Promise(r => setTimeout(r, wait))
            wait *= 2
            sanityUser = await sanityFetch({query: `*[_type == 'user' && id == '${token.sub? token.sub : token.id}']`, immediate: true})
            attempts++
        }
        if (sanityUser.length === 0) {
            return {}
        }
        // token = {...token, role: sanityUser[0]['role'], user_id: sanityUser[0]['id']}
        return {...token, role: sanityUser[0]['role'], user_id: sanityUser[0]['id']}
    }
    return token
}

export const AuthOptions : NextAuthOptions = {
    providers: [
        GithubProvider({
            clientSecret: process.env.GITHUB_SECRET || '',
            clientId: process.env.GITHUB_ID || ''
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({user, account} : {user: any, account: any,}) {
            return await signInAuthFlow({user, account})
        },
        async jwt({token} : {token: any}) {
            return await jwtFlow({token})
        },
        async session({session, token} : {session: any, token: any | null}) {
            if (token) {
                session = {...session, token}
            }
            return session
        },
    },
}

async function signInAuthFlow({user, account} : {user: any, account: any}) {
    if (process.env.AUTH_MODE === 'database') {
        return databaseSignInAuthFlow({user, account})
    } else if (process.env.AUTH_MODE === 'sanity') {
        return sanitySignInAuthFlow({user, account})
    } else {
        console.error("Invalid AUTH_MODE", process.env.AUTH_MODE)
        return false
    }
}

async function databaseSignInAuthFlow({user, account} : {user: any, account: any}) {
    const { rows, fields} = await sql`SELECT * FROM user_account WHERE id = ${user.id}`
    if (rows.length === 0) {
        try {
            await sql`INSERT INTO user_account (id, email, name, image, role) VALUES (${user.id}, ${user.email}, ${user.name}, ${user.image}, 'user')`
        } catch (error) {
            console.error("Error inserting user into database", error)
            return false
        }
        return true
    }
    return true
}