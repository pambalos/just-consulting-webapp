import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "shopSettings",
  title: "Shop Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      description: "This field is the title of the shop.",
      title: "Title",
      type: "string",
      initialValue: "Shop",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      description:
        "Used both for the <meta> description tag for SEO, and the subheader.",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: "object",
                name: "link",
                fields: [
                  {
                    type: "string",
                    name: "href",
                    title: "URL",
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "description_small",
      title: "Small Description",
      type: "array",
      description:
        "This is a short description that will be displayed under the long description.",
        of: [
            defineArrayMember({
                type: "block",
                marks: {
                    annotations: [
                      defineField({
                        type: "object",
                        name: "link",
                        fields: [
                          {
                            type: "string",
                            name: "href",
                            title: "URL",
                            validation: (rule) => rule.required(),
                          },
                        ],
                      }),
                    ],
                },
            }),
        ]
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
    })
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
});
