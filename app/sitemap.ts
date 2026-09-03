import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://portfolio-smoky-sigma-eatwqaaxyp.vercel.app";

  const staticRoutes = ["", "/work", "/blog", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectRoutes = ["APS", "propreel", "nextgentraining"].map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const blogRoutes = [
    "webflow-vs-wordpress-guide",
    "ui-ux-redesign-mistakes-killing-conversions",
    "figma-to-webflow-development-workflow",
    "modernize-slow-wordpress-website",
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
