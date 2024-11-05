"use client";

import Lightbox from "yet-another-react-lightbox";
import urlBuilder from "@sanity/image-url";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import {sanityConfig} from "@/app/utils";
import {useState} from "react";
import {MasonryPhotoAlbum, RenderImageContext, RenderImageProps} from "react-photo-album";
import {PortableText, PortableTextBlock} from "next-sanity";
import {Button, Carousel} from "react-bootstrap";
import {CartItem, CustomSession} from "@/app/customTypes";
import Image from "next/image";
import 'swiper/css';
import 'swiper/css/navigation';
import {useSession} from "next-auth/react";
import {useCart} from "@/app/(frontend)/shop/cartProvider";

async function addToCart(cart: CartItem[] | undefined, item: CartItem, service_name: string, service_id: string) {
    if (!cart) {
        cart = [];
    }
    let existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, service_title: service_name, service_id: service_id, quantity: 1});
    }
    const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({cart: cart})
    })
    if (response.ok) {
        alert("Added to cart");
    } else {
        alert("Failed to add to cart");
    }
    const data = await response.json();
    return data;
}

export default function NewServicePanel({service, ...props} : {service: any,}) {

    const {cart, setCart} = useCart();
    // @ts-ignore
    const {data: session, status} : {data: CustomSession, status: string | null} = useSession();
    const [index, setIndex] = useState(-1);
    const [images, setImages] = useState(service.images.map((image: any) => {
        return {
            src: urlBuilder(sanityConfig).image(image).url()
                || "",
            alt: image.alt || "",
            title: image.title || "",
            width: image.asset.metadata?.width === 0 ? 1000 : 1000 || 0,
            height: image.asset.metadata?.dimensions.height || 0,
        }
    }));
    function adjustCartContext(adjustedCartItem: CartItem) {
        if (cart?.length === 0) {
            setCart([{...adjustedCartItem, quantity: 1}]);
            return;
        } else {
            let cartIndex = cart?.findIndex((item: CartItem) => item._id === adjustedCartItem._id);
            if (undefined !== cartIndex && cartIndex >= 0) {
                // @ts-ignore
                let newCart = [...cart];
                newCart[cartIndex] = {...newCart[cartIndex], quantity: newCart[cartIndex].quantity + 1};
                setCart(newCart);
                return;
            }
        }
        setCart([...cart, {...adjustedCartItem, quantity: 1}]);
    }

    function renderNextImage(
        {alt, title, sizes}: RenderImageProps,
        {photo, width, height} : RenderImageContext
    ) {
        // @ts-ignore
        let imageLength = service.images.length;

        return (
            <div style={{
                width: "100%",
                position: "relative",
                aspectRatio: `${width} / ${height}`
            }}>
                <Image
                    // fill
                    className={"image-gallery-image"}
                    key={"image-"+title}
                    src={urlBuilder(sanityConfig).image(photo.src).url() || ""}
                    alt={title ? title : ""}
                    width={600/imageLength}
                    height={600/imageLength}
                    placeholder={"blurDataURL" in photo ? "blur" : undefined}
                    sizes={sizes}
                />
            </div>
        )
    }

    let lightboxEnabled = false;
    let albumEnabled = false;
    let carouselEnabled = true;
    return (
        <div className={"service-panel"}>
            {
                lightboxEnabled &&
                <Lightbox
                slides={
                    images
                }
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                plugins={[
                    Fullscreen,
                    // Slideshow,
                    Thumbnails,
                    // Zoom
                ]}
                controller={{closeOnBackdropClick: true}}
            />}
                <h3 key={"header-"+service._id}>{service.title}</h3>
                <div className={"grid service-grid"}>
                    <div className={"gii"}>
                        {images.length > 0 && albumEnabled ? <Image
                            src={urlBuilder(sanityConfig).image(service.images[0]).url() || ""}
                            alt={""}
                            width={600}
                            height={600}
                        />
                            : <></>}
                    </div>
                    <div className={"gi"}>
                        {images.length > 0 && albumEnabled ?
                            <MasonryPhotoAlbum
                                photos={images}
                                render={{image: renderNextImage}}
                                defaultContainerWidth={500}
                                onClick={({index}) => {setIndex(index)}}
                                breakpoints={[300, 600, 1200]}
                                sizes={{
                                    size: "300px",
                                }}/>
                            : <></>
                        }
                    </div>
                    <div className={"gic"}>
                        {images.length > 0 && carouselEnabled ?
                            <Carousel>
                                {
                                    images.map((image: any, index: any) => {
                                        return (
                                            <Carousel.Item className={"carousel-item"} key={"carousel-item-"+index} style={
                                                {
                                                    backgroundImage: `url(${image.src})`,
                                                    WebkitBackgroundSize: "cover",
                                                    MozBackgroundSize: "cover",
                                                    OBackgroundSize: "cover",
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    "height": "400px",
                                                }
                                            }>

                                                {/*{image.src}*/}
                                                {/*<Image*/}
                                                {/*    src={getImageURLWithSize(image, 300)}*/}
                                                {/*    alt={image.alt}*/}
                                                {/*    width={300}*/}
                                                {/*    height={300}*/}
                                                {/*/>*/}
                                            </Carousel.Item>
                                        )
                                    })
                                }
                            </Carousel>
                            : <></>
                        }
                    </div>
                    <div className={"gd"}>
                        <div className={"gd-description"}>
                            {
                                service.description?.length && (
                                    // @ts-ignore
                                    <PortableText value={service.description as PortableTextBlock[]} />
                                )
                            }
                        </div>
                        <div className={"gd-small-description"}>
                            {
                                service.shortDescription?.length && (
                                    <PortableText value={service.shortDescription as PortableTextBlock[]} />
                                )
                            }
                        </div>
                        {/*<p key={"p-1-"+service._id}>{service.description}</p>*/}
                    </div>
                    <div className={"gp"}>
                        <div className={"gp-inner"}>
                            <div className={"gp-header"}>
                                <h5>Pricing Options</h5>
                            </div>
                            <hr className="solid price-divider"></hr>
                            <div className={"list-inside"}>
                                {
                                    service.priceModels?.map((pm: any) => {
                                        return (
                                            <li className={"price-li"} key={"price-model-"+pm._id}>
                                                <div className={"service-options-div flex"}>
                                                    <label key={"p-1-"+pm._id}>{pm.title}: ${pm.price/100}</label>&nbsp;
                                                    <Button
                                                        variant={"success btn-sm"}
                                                        onClick={() => {
                                                            if (!session) {
                                                                alert("Please sign in to add to cart");
                                                                return;
                                                            }

                                                            adjustCartContext({...pm, service_title: service.title, service_id: service._id});
                                                            addToCart(cart, pm, service.title, service._id);
                                                        }}
                                                        className={"flex cart-add"}>Add to Cart</Button>
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}