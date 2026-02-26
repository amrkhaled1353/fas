import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    googleProvider,
    facebookProvider
} from '../firebase/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Track real Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const checkRes = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/users/${user.uid}.json`);

                    if (checkRes.ok) {
                        const dbUser = await checkRes.json();
                        if (dbUser.status === 'blocked') {
                            alert("Your account has been blocked by an administrator.");
                            await signOut(auth);
                            setCurrentUser(null);
                            setLoading(false);
                            return;
                        }
                    } else if (checkRes.status === 404) {
                        // User exists in Firebase but not in our DB. This means they were deleted by an Admin.
                        alert("Your account has been deleted by an administrator.");
                        await signOut(auth);
                        setCurrentUser(null);
                        setLoading(false);
                        return;
                    }

                    // User is valid, prepare context
                    const userData = {
                        id: user.uid,
                        name: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`
                    };
                    setCurrentUser(userData);

                } catch (err) {
                    console.error("Error verifying user status:", err);
                    // Fallback: If DB is unreachable, still set user so app doesn't break, but they won't be blocked.
                    setCurrentUser({
                        id: user.uid,
                        name: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`
                    });
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const syncUserToDB = async (user, name) => {
        try {
            const checkRes = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/users/${user.uid}.json`);
            let dbUser = null;
            if (checkRes.ok) {
                dbUser = await checkRes.json();
            }
            if (!checkRes.ok || checkRes.status === 404 || dbUser === null) {
                await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/users/${user.uid}.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: user.uid,
                        name: name || user.displayName || user.email.split('@')[0],
                        email: user.email,
                        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
                        dateJoined: new Date().toISOString(),
                        status: 'active'
                    })
                });
            }
        } catch (err) {
            console.error("Error syncing user to DB:", err);
        }
    };

    const register = async (name, email, password) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await syncUserToDB(res.user, name);
    };

    const loginWithProvider = async (providerName) => {
        const provider = providerName === 'google' ? googleProvider : facebookProvider;
        const res = await signInWithPopup(auth, provider);
        await syncUserToDB(res.user, res.user.displayName);
        return res;
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        login,
        register,
        loginWithProvider,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
