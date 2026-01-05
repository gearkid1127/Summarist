"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";


// 1️⃣ Shape of the data we’ll expose
type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

// 2️⃣ Create the context (empty for now)
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// 3️⃣ Provider component that wraps the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 4️⃣ Subscribe to Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    // 5️⃣ Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6️⃣ Convenience hook so components can use the context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
