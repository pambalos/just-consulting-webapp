import {defineType} from "sanity";

export default defineType({
    name: "availability",
    type: "document",
    title: "Availability",
    fields: [
        {
            name: "slots",
            title: "Slots",
            type: "number",
        },
        {
            name: "slots_taken",
            title: "Slots Taken",
            type: "number",
        },
        {
            name: "service_ref",
            title: "Service",
            type: "reference",
            to: [{type: "services"}],
            options: {
                disableNew: true,
            },
            validation: (rule) => rule.required(),
        }
    ]
});