import {cartGET, cartPOST} from "@/app/api/(shop)/shopRoutes";

export async function GET(request: Request) {
    return cartGET(request)
}

export async function POST(request: Request) {
    return cartPOST(request)
}