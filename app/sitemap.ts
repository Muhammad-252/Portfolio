import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://portfolio-smoky-sigma-eatwqaaxyp.vercel.app";

  const staticRoutes = [
    "",
    "/work",
    "/services",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectSlugs = [
    "propreel",
    "estateflow-real-estate",
    "medipulse-telehealth",
    "cloudscale-ai-analytics",
    "luxecraft-ecommerce",
    "finova-wealth-management",
    "eduvantage-lms",
  ];

  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const blogSlugs = [
    "webflow-vs-wordpress-guide",
    "ui-ux-redesign-mistakes-killing-conversions",
    "figma-to-webflow-development-workflow",
    "modernize-slow-wordpress-website",
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
