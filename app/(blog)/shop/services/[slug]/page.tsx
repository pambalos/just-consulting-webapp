import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/fetch";
import {notFound} from "next/navigation";
import {CartItem} from "@/app/customTypes";
import NewServicePanel from "@/app/(blog)/shop/newServicePanel";
import {fetchedSanityService, sanityConfig} from "@/app/utils";
import {servicesQuery, shopSettingsQuery} from "@/sanity/lib/queries";
import urlBuilder from "@sanity/image-url";
import Image from "next/image";


type Props = {
    params: { slug: string, service: any, cart: CartItem[], setCart: any, saveCart: any };
}

const serviceSlugs = defineQuery(
    `*[_type == "services" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
    return await sanityFetch({
        query: serviceSlugs,
        perspective: "published",
        stega: false,
    });
}

async function fetchService(slug: string) {
    const priceModels = await fetchedSanityService(slug);
    return priceModels;
}

export default async function ServicePage({ params }: Props) {
    console.log("service page params", params);
    const  service = await fetchService(params.slug);
    const shopSettings = await sanityFetch({
            query: shopSettingsQuery,
        });

    if (!service?._id) {
        return notFound();
    }

    return (
        <div>
            {shopSettings?.backgroundImage && <Image
                src={urlBuilder(sanityConfig).image(shopSettings?.backgroundImage).url() || ""}
                alt={"background image"}
                layout={"fill"}
                objectFit={"cover"}
                objectPosition={"center"}
                className={"services-background"}
            />}
            <div className={"services-header-nav"}>
                <a href={"/shop/services"} className={"back-to-services"}>
                    <h1>&nbsp; &lt; Services</h1>
                </a>
            </div>

            {/*<p>{service.description}</p>*/}
            <NewServicePanel service={service} />
        </div>
    );
}