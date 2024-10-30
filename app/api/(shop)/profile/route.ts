import {profileGET} from "@/app/api/(shop)/shopRoutes";


export async function GET(req: any, res: any) {
    // we want to fetch all the account details including any past orders
    return profileGET(req)
}