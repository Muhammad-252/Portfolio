import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const configured = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
const app = configured ? (getApps().length ? getApps()[0] : initializeApp(config)) : null;

export const firebaseConfigured = configured;

let _auth: any = null;
export const getFirebaseAuth = () => {
  if (typeof window === "undefined") return null;
  if (!_auth && app) {
    _auth = getAuth(app);
  }
  return _auth;
};

export const auth: any =
  typeof window !== "undefined"
    ? new Proxy(
        {},
        {
          get(_target, prop) {
            const instance = getFirebaseAuth();
            if (!instance) return null;
            const val = (instance as any)[prop];
            return typeof val === "function" ? val.bind(instance) : val;
          },
        }
      )
    : null;

export const db: any = app ? getFirestore(app) : null;
export const storage: any = app ? getStorage(app) : null;
