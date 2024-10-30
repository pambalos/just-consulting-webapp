import {checkoutPOST} from "@/app/api/(shop)/shopRoutes";

export async function POST(request: Request) {
    return checkoutPOST(request)
}