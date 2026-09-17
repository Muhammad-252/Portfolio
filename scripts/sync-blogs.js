const fs = require('fs');
const path = require('path');

function parseMdx(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!frontmatterMatch) throw new Error('No frontmatter in ' + filePath);

  const fmLines = frontmatterMatch[1].split('\n');
  const meta = {};
  fmLines.forEach((l) => {
    const idx = l.indexOf(':');
    if (idx !== -1) {
      const k = l.slice(0, idx).trim();
      let v = l.slice(idx + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      else if (v.startsWith('[') && v.endsWith(']')) {
        v = v
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''));
      } else if (v === 'true') v = true;
      else if (v === 'false') v = false;
      else if (!isNaN(Number(v))) v = Number(v);
      meta[k] = v;
    }
  });

  const content = frontmatterMatch[2].trim();
  return { ...meta, content };
}

const files = [
  'content/blogs/webflow-vs-wordpress-guide.mdx',
  'content/blogs/ui-ux-redesign-mistakes-killing-conversions.mdx',
  'content/blogs/figma-to-webflow-development-workflow.mdx',
  'content/blogs/modernize-slow-wordpress-website.mdx',
];

const articles = files.map((f) => parseMdx(f));
console.log(
  'Parsed articles:',
  articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    words: a.content.split(/\s+/).length,
  }))
);

// Generate lib/useBlogPosts.ts
const code = `"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { BlogPost } from "./blogTypes";

export const DEFAULT_AUTHOR = {
  name: "Muhammad Arslan",
  role: "Lead UI/UX & Product Designer",
  avatar: "/images/hero-portrait-v3.png",
};

export const SAMPLE_BLOG_POSTS: BlogPost[] = ${JSON.stringify(
  articles.map((a, idx) => ({
    id: a.slug,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    cover: a.cover,
    category: a.category,
    tags: a.tags,
    author: {
      name: a.author || "Muhammad Arslan",
      role: "Lead UI/UX & Product Designer",
      avatar: "/images/hero-portrait-v3.png",
    },
    date: a.date,
    readingTime: a.readingTime,
    featured: idx === 0,
    published: true,
    order: idx + 1,
  })),
  null,
  2
)};

const LOCAL_STORAGE_BLOG_KEY = "portfolio_blog_posts_v3";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  // Read initial from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_BLOG_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not read blog posts from localStorage", e);
      }
    }
  }, []);

  // Sync with Supabase
  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase
      .from("posts")
      .select("*")
      .order("order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPosts(data as BlogPost[]);
        }
        setLoading(false);
      });
  }, []);

  // Helper to save or update a post in Supabase
  const savePost = useCallback(async (post: BlogPost) => {
    if (supabaseConfigured) {
      await supabase.from("posts").upsert(post);
    }
  }, []);

  // Helper to delete a post
  const deletePost = useCallback(async (id: string) => {
    if (supabaseConfigured) {
      await supabase.from("posts").delete().eq("id", id);
    }
  }, []);

  return { posts, loading, savePost, deletePost };
}
`;

fs.writeFileSync('lib/useBlogPosts.ts', code, 'utf8');
console.log('Successfully updated lib/useBlogPosts.ts with all 4 authoritative articles!');
