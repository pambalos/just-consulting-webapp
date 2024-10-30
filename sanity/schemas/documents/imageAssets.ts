import {defineField, defineType} from "sanity";
import {ImageIcon} from "@sanity/icons";
import {requiredImageFieldWithOptions} from "@/sanity/schemas/documents/commonSchemaTypes";


export default defineType({
    name: "imageAssets",
    title: "Image Assets",
    type: "document",
    icon: ImageIcon,
    fields: [
        requiredImageFieldWithOptions("picture", "Picture"),
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "assetGroup",
            title: "Asset Group",
            type: "string",
            validation: (rule) => rule.required(),
        }),
    ]
});