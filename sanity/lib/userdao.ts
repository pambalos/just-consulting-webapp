import {SanityDocumentStub} from "next-sanity";
import {client} from "@/sanity/lib/client";
import {writeToken} from "@/sanity/lib/token";


export async function sanityCreate({
    document,
     }:
     {
        document: SanityDocumentStub,
    }) {
    return client.create(document, {
        token: writeToken
    });
}