import {defineField} from "sanity";


export function requiredImageFieldWithOptions(name : any, title : any) {
    return defineField({
        name: name,
        title: title,
        type: "image",
        fields: [
            {
                name: "alt",
                type: "string",
                title: "Alternative text",
                description: "Important for SEO and accessibility.",
                validation: (rule) => {
                    return rule.custom((alt, context) => {
                        if ((context.document?.picture as any)?.asset?._ref && !alt) {
                            return "Required";
                        }
                        return true;
                    });
                },
            },
        ],
        options: {
            hotspot: true,
            aiAssist: {
                imageDescriptionField: "alt",
            },
        },
        validation: (rule) => rule.required(),
    })
}