import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https:;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebasestorage.app https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
  frame-src 'self' https://*.firebaseapp.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self' mailto: https://wa.me;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "**.cdn.bubble.io" },
      { protocol: "https", hostname: "**.bubble.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
      },
    ];
  },
};

export default nextConfig;
