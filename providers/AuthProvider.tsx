"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";



// 1️⃣ Shape of the data we’ll expose
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
};

// 2️⃣ Create the context (empty for now)
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// 3️⃣ Provider component that wraps the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);


  useEffect(() => {
    // 4️⃣ Subscribe to Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  setUser(firebaseUser);

  if (!firebaseUser) {
    setIsPremium(false);
    setLoading(false);
    return;
  }

  const snap = await getDoc(doc(db, "users", firebaseUser.uid));
  const data = snap.exists() ? snap.data() : null;

  setIsPremium(Boolean(data?.isPremium));
  setLoading(false);
});


    // 5️⃣ Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isPremium }}>
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
