import {defineType} from "sanity";

export default defineType({
    name: 'userCarts',
    title: 'User Carts',
    type: 'document',
    fields: [
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{type: 'user'}]
        },
        {
            name: 'cart',
            title: 'Cart',
            type: 'array',
            of: [{
                    type: 'cartItem'
                }]
        }
    ]
})