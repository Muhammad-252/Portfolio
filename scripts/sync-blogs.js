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
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
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

  // Sync with Firestore
  useEffect(() => {
    if (!firebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "posts"), orderBy("order", "asc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedPosts: BlogPost[] = [];
            snapshot.forEach((docSnap) => {
              fetchedPosts.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
            });
            setPosts(fetchedPosts);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(
                  LOCAL_STORAGE_BLOG_KEY,
                  JSON.stringify(fetchedPosts)
                );
              } catch (e) {
                console.warn("Could not save blog posts to localStorage", e);
              }
            }
          }
          setLoading(false);
        },
        (error) => {
          if (error.code !== "permission-denied") {
            console.warn("Firestore posts listener error:", error.message);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn("Error setting up Firestore posts listener", e);
      setLoading(false);
    }
  }, []);

  // Helper to save or update a post in Firestore
  const savePost = useCallback(async (post: BlogPost) => {
    if (!firebaseConfigured || !db) {
      setPosts((prev) => {
        const idx = prev.findIndex((p) => p.slug === post.slug);
        let updated: BlogPost[];
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = post;
        } else {
          updated = [post, ...prev];
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(updated));
        }
        return updated;
      });
      return;
    }

    const docId = post.id || post.slug;
    const postRef = doc(db, "posts", docId);
    await setDoc(postRef, { ...post, id: docId });
  }, []);

  // Helper to delete a post
  const deletePost = useCallback(async (id: string) => {
    if (!firebaseConfigured || !db) {
      setPosts((prev) => {
        const updated = prev.filter((p) => p.id !== id && p.slug !== id);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(updated));
        }
        return updated;
      });
      return;
    }

    await deleteDoc(doc(db, "posts", id));
  }, []);

  return { posts, loading, savePost, deletePost };
}
`;

fs.writeFileSync('lib/useBlogPosts.ts', code, 'utf8');
console.log('Successfully updated lib/useBlogPosts.ts with all 4 authoritative articles!');
