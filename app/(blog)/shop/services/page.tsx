import {sanityFetch} from "@/sanity/lib/fetch";
import {servicesQuery, settingsQuery, shopSettingsQuery} from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import PortableText from "@/app/(blog)/portable-text";
import Image from "next/image";
import urlBuilder from "@sanity/image-url";
import {sanityConfig} from "@/app/utils";


// collect shop settings from sanity


export default async function ServiceLandingPage(
    {params}: any
) {
    console.log("service landing page params", params);
    const [shopSettings, services] = await Promise.all([
        sanityFetch({
            query: shopSettingsQuery,
        }),
        sanityFetch({ query: servicesQuery }),
    ]);

    console.log("shop settings", shopSettings);

    return (
        <div className={"services-landing-page"}>
            {shopSettings?.backgroundImage && <Image
                src={urlBuilder(sanityConfig).image(shopSettings?.backgroundImage).url() || ""}
                alt={"background image"}
                layout={"fill"}
                objectFit={"cover"}
                objectPosition={"center"}
                className={"services-background"}
            />}
            <div className={"services-wrapper"}>
                <div className={"services-header"}>
                    <h1>{shopSettings?.title}</h1>
                    {shopSettings?.description && <PortableText
                        className="prose-lg"
                        // @ts-ignore
                        value={shopSettings?.description}
                    />}
                    <hr className="solid"></hr>
                </div>
                <ul className={"services-ul"}>
                    {services.map((service: any) => (
                        <a key={service._id + "-anchor"} href={`services/${service.slug.current}`}>
                            <li key={service._id}>
                                <h2>{service.title}</h2>
                                {/*<p>{service.description}</p>*/}
                            </li>
                        </a>
                    ))}
                </ul>
            </div>
        </div>
    )
}