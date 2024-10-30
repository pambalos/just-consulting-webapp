import {defineType} from "sanity";

export default defineType({
    name: 'cartItem',
    title: 'Cart Item',
    type: 'document',
    fields: [
        {
            name: 'service',
            title: 'Service',
            type: 'reference',
            to: [{type: 'services'}],
        },
        {
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            validation: Rule => Rule.required().min(1)
        }
    ]
})