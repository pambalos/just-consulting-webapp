import {fetchedSanityServices} from "@/app/utils";

export async function GET(req: any, res: any) {
    const services = await fetchedSanityServices();
    return new Response(JSON.stringify(services));
}