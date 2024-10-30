import "../globals.css";

import {SpeedInsights} from "@vercel/speed-insights/next";
import type {Metadata} from "next";
import {type PortableTextBlock, toPlainText, VisualEditing,} from "next-sanity";
import {Inter} from "next/font/google";
import {draftMode} from "next/headers";
import {Suspense, useContext} from "react";

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";

import * as demo from "@/sanity/lib/demo";
import {sanityFetch} from "@/sanity/lib/fetch";
import {settingsQuery} from "@/sanity/lib/queries";
import {resolveOpenGraphImage} from "@/sanity/lib/utils";
import {Providers} from "@/app/(blog)/providers";
import SiteNavbar from "@/app/navbar";
import {getServerSession, NextAuthOptions} from "next-auth";
import {CartItem, CustomSession} from "@/app/customTypes";
import {AuthOptions} from "@/app/auth";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;
  const userToken = null;
  const cart = null;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

async function Footer() {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];

  return (
    <footer className="bg-accent-1 border-accent-2 border-t">
      <link
          rel="stylesheet"
          href={"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"}
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
      />
      <div className="container mx-auto px-5">
          <PortableText
            className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
            value={footer as PortableTextBlock[]}
          />
      </div>
    </footer>
  );
}

async function getSessionServerUtil(authOptions: NextAuthOptions) : Promise<CustomSession | null> {
  return await getServerSession(authOptions);
}

async function saveCart(cart: CartItem[]) {
  const cartJson = {
    "cart":
        cart.map((product) => {
          return JSON.stringify(product);
        })
  };
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartJson)
    })
  } catch (error) {
    console.error("KV Error: ", error);
  }
  return void 0;
}

export const revalidate = 60;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = await getSessionServerUtil(AuthOptions);

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
    {/*<Provider store={store}>*/}
      <body>
        <Providers>
          {/*<CartProvider>*/}
            <header className="">
              <SiteNavbar session={session} />
            </header>
            <section className="min-h-screen">
              {draftMode().isEnabled && <AlertBanner />}
              {/*<Cart />*/}
              <main>{children}</main>
              <Suspense>
                <Footer />
              </Suspense>
            </section>
            {draftMode().isEnabled && <VisualEditing />}
            <SpeedInsights />
          {/*</CartProvider>*/}
        </Providers>
      </body>
    {/*</Provider>*/}
    </html>
  );
}
