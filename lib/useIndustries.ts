"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, firebaseConfigured } from "@/lib/firebase";
import { DEFAULT_INDUSTRIES } from "@/lib/categories";

const LOCAL_STORAGE_KEY = "portfolio_dynamic_industries";

export function useIndustries() {
  const [industries, setIndustries] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Failed to read industries from localStorage", e);
      }
    }
    return Array.from(DEFAULT_INDUSTRIES);
  });

  const [loading, setLoading] = useState(true);

  // Sync to Firestore if configured
  const persistIndustries = useCallback(async (updatedList: string[]) => {
    setIndustries(updatedList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.error("Failed to save industries to localStorage", e);
      }
    }

    if (firebaseConfigured && db && auth?.currentUser) {
      try {
        const docRef = doc(db, "settings", "taxonomies");
        await setDoc(docRef, { industries: updatedList }, { merge: true });
      } catch (error) {
        if ((error as any)?.code !== "permission-denied") {
          console.error("Error saving industries to Firestore:", error);
        }
      }
    }
  }, []);

  // Initial load from Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadFromFirestore() {
      if (!firebaseConfigured || !db) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "settings", "taxonomies");
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.industries) && data.industries.length > 0) {
            if (isMounted) {
              setIndustries(data.industries);
              if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.industries));
              }
            }
          } else if (auth?.currentUser) {
            // Only authenticated admin initializes
            await setDoc(docRef, { industries: Array.from(DEFAULT_INDUSTRIES) }, { merge: true });
          }
        } else if (auth?.currentUser) {
          // Document doesn't exist yet - only admin initializes
          await setDoc(docRef, { industries: Array.from(DEFAULT_INDUSTRIES) }, { merge: true });
        }
      } catch (err) {
        if ((err as any)?.code !== "permission-denied") {
          console.warn("Notice loading industries from Firestore, using default:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFromFirestore();

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
