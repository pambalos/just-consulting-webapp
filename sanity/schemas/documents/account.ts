import {defineType} from "sanity";

export default defineType({
    // account - required
    name: 'account',
    title: 'Account',
    type: 'document',
    fields: [
        {
            name: 'providerType',
            type: 'string'
        },
        {
            name: 'providerId',
            type: 'string'
        },
        {
            name: 'providerAccountId',
            type: 'string'
        },
        {
            name: 'refreshToken',
            type: 'string'
        },
        {
            name: 'accessToken',
            type: 'string'
        },
        {
            name: 'accessTokenExpires',
            type: 'number'
        },
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: { type: 'user' }
        }
    ]
});