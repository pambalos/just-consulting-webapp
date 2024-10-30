"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import {advancedPageStructure, singletonPlugin} from "@/sanity/plugins/settings";
import { assistWithPresets } from "@/sanity/plugins/assist";
import { resolveHref } from "@/sanity/lib/utils";

import author from "@/sanity/schemas/documents/author";
import post from "@/sanity/schemas/documents/post";
import settings from "@/sanity/schemas/singletons/settings";
import user from "@/sanity/schemas/documents/user";
import services from "@/sanity/schemas/documents/services";
import availability from "@/sanity/schemas/documents/availability";
import priceModel from "@/sanity/schemas/documents/priceModel";
import usercarts from "@/sanity/schemas/documents/usercarts";
import cartItem from "@/sanity/schemas/documents/cartItem";
import imageAssets from "@/sanity/schemas/documents/imageAssets";

import { codeInput } from '@sanity/code-input'
import shopSettings from "@/sanity/schemas/singletons/shopSettings";

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

export default defineConfig({
  basePath: studioUrl,
  name: "JustConsulting_Studio",
  projectId: "k3xn62gp",
  dataset: "production",
  schema: {
    types: [
      // Singletons
      settings,
      shopSettings,
      // Documents
      post,
      author,
      user,
      availability,
      services,
      priceModel,
      usercarts,
      cartItem,
      imageAssets
    ],
  },
  plugins: [
    codeInput(),
    visionTool(),
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/blog/posts/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/blog/author/:slug",
            filter: `_type == "author" && slug.current == $slug`,
          },
          {
            route: "/shop/user/:slug",
            filter: `_type == "user" && slug.current == $slug`,
          }
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: "This document is used on all pages",
            tone: "caution",
          }),
          post: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled",
                  href: resolveHref("post", doc?.slug)!,
                },
                homeLocation,
              ],
            }),
          }),

        },
      },
      previewUrl: { previewMode: { enable: "/api/draft" } },
    }),
    structureTool({
      structure: advancedPageStructure([settings, shopSettings], [post, author], [user, services, availability, priceModel, usercarts, cartItem]),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Sets up AI Assist with preset prompts
    // https://www.sanity.io/docs/ai-assist
    assistWithPresets(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // process.env.NODE_ENV === "development" &&
    //   visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
