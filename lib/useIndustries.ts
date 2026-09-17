"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { DEFAULT_INDUSTRIES } from "@/lib/categories";

const LOCAL_STORAGE_KEY = "portfolio_dynamic_industries";

export function useIndustries() {
  const [industries, setIndustries] = useState<string[]>(() => Array.from(DEFAULT_INDUSTRIES));

  const [loading, setLoading] = useState(true);

  // Sync to Supabase if configured
  const persistIndustries = useCallback(async (updatedList: string[]) => {
    setIndustries(updatedList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.error("Failed to save industries to localStorage", e);
      }
    }

    if (supabaseConfigured) {
      try {
        const { error } = await supabase
          .from("settings")
          .upsert({
            key: "taxonomies",
            value: { industries: updatedList },
            updated_at: new Date().toISOString(),
          });
        if (error) {
          console.error("Error saving industries to Supabase:", error);
        }
      } catch (error) {
        console.error("Error saving industries to Supabase:", error);
      }
    }
  }, []);

  // Initial load from localStorage & Supabase
  useEffect(() => {
    let isMounted = true;

    // Check localStorage safely after client hydration
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setIndustries(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to read industries from localStorage", e);
      }
    }

    async function loadFromSupabase() {
      if (!supabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "taxonomies")
          .maybeSingle();

        if (data && data.value && Array.isArray(data.value.industries) && data.value.industries.length > 0) {
          if (isMounted) {
            setIndustries(data.value.industries);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.value.industries));
            }
          }
        }
      } catch (err) {
        console.warn("Notice loading industries from Supabase, using default:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const addIndustry = useCallback(
    async (rawName: string): Promise<boolean> => {
      const name = rawName.trim();
      if (!name) return false;
      if (industries.some((i) => i.toLowerCase() === name.toLowerCase())) {
        return false; // Already exists
      }
      const updated = [...industries, name].sort((a, b) => a.localeCompare(b));
      await persistIndustries(updated);
      return true;
    },
    [industries, persistIndustries]
  );

  const updateIndustry = useCallback(
    async (oldName: string, newNameRaw: string): Promise<boolean> => {
      const newName = newNameRaw.trim();
      if (!newName || oldName === newName) return false;
      if (
        industries.some(
          (i) => i.toLowerCase() === newName.toLowerCase() && i.toLowerCase() !== oldName.toLowerCase()
        )
      ) {
        return false; // Duplicate
      }
      const updated = industries
        .map((item) => (item === oldName ? newName : item))
        .sort((a, b) => a.localeCompare(b));
      await persistIndustries(updated);
      return true;
    },
    [industries, persistIndustries]
  );

  const deleteIndustry = useCallback(
    async (nameToDelete: string): Promise<boolean> => {
      const updated = industries.filter((item) => item !== nameToDelete);
      await persistIndustries(updated);
      return true;
    },
    [industries, persistIndustries]
  );

  const resetToDefaults = useCallback(async () => {
    await persistIndustries(Array.from(DEFAULT_INDUSTRIES));
  }, [persistIndustries]);

  return {
    industries,
    loading,
    addIndustry,
    updateIndustry,
    deleteIndustry,
    resetToDefaults,
  };
}
