import {sanityFetch} from "@/sanity/lib/fetch";
import { cache } from 'react'
import {createClient} from "@sanity/client";

export const fetchedSanityServices = cache(async () => {
    return await sanityFetch({
        query: `*[_type == "services"]{_id, title, description, shortDescription, priceModels[]->, images[]{_key, _type, asset->}}`
    })
})

export const fetchedSanityService = cache(async (slug: string) => {
    return await sanityFetch({
        query: `*[_type == "services" && slug.current == "${slug}"][0]{_id, title, description, shortDescription, priceModels[]->, images[]{_key, _type, asset->}}`
    })
})

export const fetchedSanityServicePriceModels = cache(async () => {
    return await sanityFetch({
        query: `*[_type == "priceModel"]`
    })
})

export function createSQLValuesString(values: any[]) {
    return `${values.map((value) => {
        return `(${value.map((v: any) => {
            if (typeof v === "string") {
                return `'${v}'`
            } else {
                return v
            }
        }).join(", ")})`
    }).join(", ")}`
}


export const sanityConfig = createClient({
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: true,
    apiVersion: '2021-03-25',
});
export function SquareHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.SQUARE_ACCESS_TOKEN,
        "Square-Version": "2024-09-19",
    }
}

