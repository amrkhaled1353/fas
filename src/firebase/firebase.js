import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
export let auth;
export let googleProvider;
export let facebookProvider;

if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    facebookProvider = new FacebookAuthProvider();
} else {
    console.warn("Firebase Auth config is missing. Authentication features will be disabled until VITE_FIREBASE_API_KEY is provided in .env");

    // Create dummy objects to prevent immediate crashes in contexts referencing them
    auth = {
        onAuthStateChanged: (cb) => { cb(null); return () => { }; },
        currentUser: null,
        signInWithEmailAndPassword: () => Promise.reject(new Error("Auth not configured")),
        createUserWithEmailAndPassword: () => Promise.reject(new Error("Auth not configured")),
        signOut: () => Promise.resolve()
    };
    googleProvider = {};
    facebookProvider = {};
}
