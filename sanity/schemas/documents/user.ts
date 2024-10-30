// user - required

import {defineType} from "sanity";

export default defineType( {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'id',
            title: 'ID',
            type: 'string',
            validation: Rule => Rule.unique()
        },
        {
            name: 'provider',
            title: 'Provider',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'url'
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
                list: [
                    {title: 'User', value: 'user'},
                    {title: 'Admin', value: 'admin'}
                ]
            }
        },
        {
            // this is only if you use credentials provider
            name: 'password',
            type: 'string',
            hidden: true
        },
        {
            name: 'emailVerified',
            type: 'datetime',
            hidden: true,
        }
    ],

});