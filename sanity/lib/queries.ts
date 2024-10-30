import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);
export const shopSettingsQuery = defineQuery(`*[_type == "shopSettings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const signupUserQuery = defineQuery(`
    *[_type == "user" && email == $email] [0] {
        _id,
        email,
        name,
        password,
        role,
    }
    `);

const serviceFields = /* groq */ `
  _id,
  title,
  blurb,
  slug,
  description,
  "shortDescription": pt::text(shortDescription),
  images
`;

export const serviceQuery = defineQuery(`
    *[_type == "services" && slug.current == $slug] [0] {
        ${serviceFields},
    }
    `);

export const servicesQuery = defineQuery(`
    *[_type == "services"] {
      ${serviceFields},
    }
    `);