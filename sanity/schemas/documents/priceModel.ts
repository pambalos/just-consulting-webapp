import {defineType} from "sanity";

export default defineType({
    name: "priceModel",
    type: "document",
    title: "Price Model",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            // readOnly: true,
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "pricing_model",
            title: "Pricing Model",
            type: "string",
            options: {
                list: [
                    {title: "Fixed", value: "fixed"},
                    {title: "Hourly", value: "hourly"},
                    {title: "Daily", value: "daily"},
                ],
            }
        },
        {
            name: "price",
            title: "Price (in cents)",
            type: "number",
        },
        // {
        //     name: "service_ref",
        //     title: "Service",
        //     type: "reference",
        //     to: [{type: "services"}],
        //     options: {
        //         disableNew: true,
        //     },
        //     validation: (rule) => rule.required(),
        // }
    ],
    preview: {
        select: {
            title: "title",
            price: "price",
            model: "pricing_model",
        },
        prepare(selection) {
            return {
                title: selection.title,
                subtitle: `${selection.model} - $${selection.price/100}`,
            }
        }
    }
});