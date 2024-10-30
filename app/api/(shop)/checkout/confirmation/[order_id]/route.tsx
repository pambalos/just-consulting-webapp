import {checkoutConfirmationOrderIdGET} from "@/app/api/(shop)/shopRoutes";


export async function GET(request: Request) {
    return checkoutConfirmationOrderIdGET(request)
}