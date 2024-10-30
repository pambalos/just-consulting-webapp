import {defineField, defineType} from "sanity";


const blockContentTypes = [
    {
        type: "block",
        styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'H5', value: 'h5'},
            {title: 'H6', value: 'h6'},
            {title: 'Quote', value: 'blockquote'}
        ],
        marks: {
            annotations: [
                {
                    name: "link",
                    type: "object",
                    title: "External link",
                    fields: [
                        {
                            name: "href",
                            title: "URL",
                            type: "url",
                            // @ts-ignore
                            validation: Rule => Rule.uri({
                                scheme: ['http', 'https', 'mailto', 'tel']
                            })
                        },
                        {
                            title: "Open in new tab",
                            name: "blank",
                            type: "boolean",
                        }
                    ]
                }
            ]
        }
    },
    {
        type: "image",
    }, { type: "code" }];

export default defineType({
    name: "services",
    title: "Services",
    type: "document",
    fields: [
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            description: "A slug is required for the service to show up in the preview",
            options: {
                source: "title",
                maxLength: 96,
                isUnique: (value, context) => context.defaultIsUnique(value, context),
            },
            validation: (rule) => rule.required(),
        }),
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        {
          name: "blurb",
        title: "Blurb",
        type: "string",
        },
        {
            name: "description",
            title: "Main Description",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        {title: 'Normal', value: 'normal'},
                        {title: 'H1', value: 'h1'},
                        {title: 'H2', value: 'h2'},
                        {title: 'H3', value: 'h3'},
                        {title: 'H4', value: 'h4'},
                        {title: 'H5', value: 'h5'},
                        {title: 'H6', value: 'h6'},
                        {title: 'Quote', value: 'blockquote'}
                    ],
                    marks: {
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "External link",
                                fields: [
                                    {
                                        name: "href",
                                        title: "URL",
                                        type: "url",
                                        // @ts-ignore
                                        validation: Rule => Rule.uri({
                                            scheme: ['http', 'https', 'mailto', 'tel']
                                        })
                                    },
                                    {
                                        title: "Open in new tab",
                                        name: "blank",
                                        type: "boolean",
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    type: "image",
                }, { type: "code" }],
        },
        {
            name: "shortDescription",
            title: "Short Description",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        {title: 'Normal', value: 'normal'},
                        {title: 'H1', value: 'h1'},
                        {title: 'H2', value: 'h2'},
                        {title: 'H3', value: 'h3'},
                        {title: 'H4', value: 'h4'},
                        {title: 'H5', value: 'h5'},
                        {title: 'H6', value: 'h6'},
                        {title: 'Quote', value: 'blockquote'}
                    ],
                    marks: {
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "External link",
                                fields: [
                                    {
                                        name: "href",
                                        title: "URL",
                                        type: "url",
                                        // @ts-ignore
                                        validation: Rule => Rule.uri({
                                            scheme: ['http', 'https', 'mailto', 'tel']
                                        })
                                    },
                                    {
                                        title: "Open in new tab",
                                        name: "blank",
                                        type: "boolean",
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    type: "image",
                }, { type: "code" }],
        },
        {
            name: "images",
            title: "Images",
            type: "array",
            of: [{type: "image"}]
        },
        {
            name: "priceModels",
            title: "Price Models",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{type: "priceModel"}],
                }
            ]
        }
    ],
});