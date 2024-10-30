import {checkoutOrderIdGET} from "@/app/api/(shop)/shopRoutes";


export async function GET(request: Request) {
    return checkoutOrderIdGET(request)
}