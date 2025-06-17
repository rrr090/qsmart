import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseConfig'; 
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (user) {
                
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                let userData = {}; 
                if (userDocSnap.exists()) {
                    userData = userDocSnap.data();
                }

                const userWithRoleAndName = {
                    ...user, 
                    role: userData.role || 'user', 
                    name: userData.name || null 
                };

                if (userWithRoleAndName.role === 'admin') {
                    setCurrentUser(userWithRoleAndName);
                } else {
                    setCurrentUser(userWithRoleAndName);
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

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}