/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // Used to guard against accidentally leaking SANITY_API_READ_TOKEN to the browser
    taint: true,
    // serverActions: true,
  },
  logging: {
    fetches: { fullUrl: false },
  },
  images: {
    remotePatterns:
        [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "platform-lookaside.fbsbx.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.gravatar.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.google.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.facebook.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.linkedin.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.instagram.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.twitter.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.youtube.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.pinterest.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.behance.net",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.dribbble.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.github.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.medium.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.dev.to",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.codepen.io",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.stackoverflow.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.reddit.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.producthunt.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "www.twitch.tv",
                pathname: "**",
            }
        ]
  }
};
