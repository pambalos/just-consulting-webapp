/**
 * This plugin contains all the logic for setting up the singletons
 */

import { definePlugin, type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/structure";
import settings from "@/sanity/schemas/singletons/settings";
import imageAsset from "@/sanity/schemas/documents/imageAssets";

export const singletonPlugin = definePlugin((types: string[]) => {
  return {
    name: "singletonPlugin",
    document: {
      // Hide 'Singletons (such as Settings)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev, { creationContext, ...rest }) => {
        if (creationContext.type === "global") {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId),
          );
        }

        return prev;
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== "duplicate");
        }

        return prev;
      },
    },
  };
});

export const advancedPageStructure = (singletonDocuments: DocumentDefinition[], blogDocuments: DocumentDefinition[], shopDocuments: DocumentDefinition[]): StructureResolver => {
    return (S, context) => {
        if (context?.currentUser?.role !== "administrator") {
            singletonDocuments = singletonDocuments.filter((singleton) => singleton.name === "settings");
            shopDocuments = shopDocuments.filter((shopDocument) => shopDocument.name === "cartItem" || shopDocument.name === "usercarts" || shopDocument.name === "services" || shopDocument.name === "availability" || shopDocument.name === "priceModel" || shopDocument.name === "user");
        }

        const singletonItems = singletonDocuments.map((typeDef) => {
            return S.listItem()
                .title(typeDef.title!)
                .icon(typeDef.icon)
                .child(
                    S.editor()
                        .id(typeDef.name)
                        .schemaType(typeDef.name)
                        .documentId(typeDef.name),
                );
        });

        const blogItems = S.listItem()
            .title("Blog")
            .icon(() => "📝")
            .child(
                S.list()
                    .title("Blog")
                    .items(
                        S.documentTypeListItems().filter(
                            (listItem) =>
                                blogDocuments.find((blogDocument) => blogDocument.name === listItem.getId()),
                        ),
                    ),
            );

        shopDocuments = shopDocuments.filter((shopDocument) => shopDocument.name !== "priceModel" && shopDocument.name !== "services");

        const shopItems = S.listItem()
            .title("Shop")
            .icon(() => "🛒")
            .child(
                S.list()
                    .title("Shop")
                    .items([
                        S.listItem()
                            .title("Services")
                            .icon(() => "🛒")
                            .child(
                                S.documentTypeList("services")
                                    .title("Services Offered")

                                    ,
                            ),
                            ...S.documentTypeListItems().filter(
                                (listItem) =>
                                    shopDocuments.find((shopDocument) => shopDocument.name === listItem.getId()),
                            ),
                        ]
                    ),
            );

        const sharedItems = S.listItem()
            .title("Shared")
            .icon(() => "🔗")
            .child(
                S.list()
                    .title("Assets")
                    .items([
                        S.listItem()
                            .title("Images")
                            .icon(() => "🖼")
                            .child(
                                S.documentTypeList("imageAssets")
                                    .title("Images Docs")
                                    ,
                            ),
                        S.listItem()
                            .title("Sanity Image Store")
                            .icon(() => "🖼")
                            .child(
                                S.documentList()
                                    .title("Sanity Images")
                                    .filter('_type == "sanity.imageAsset"')
                                    ,
                            ),
                    ])
            )

        return S.list()
            .title("Content")
            .items([...singletonItems, S.divider(), blogItems, shopItems, sharedItems]);
    }
}

