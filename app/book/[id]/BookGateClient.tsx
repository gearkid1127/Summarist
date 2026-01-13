"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

type Props = {
  subscriptionRequired?: boolean | string | number;
};

export default function BookGateClient({ subscriptionRequired }: Props) {
  const router = useRouter();
  const { user, loading, isPremium } = useAuth();

  const requiresSub =
    subscriptionRequired === true ||
    subscriptionRequired === "true" ||
    subscriptionRequired === 1 ||
    subscriptionRequired === "1";

  useEffect(() => {
    if (loading) return;

    // If this book is premium and the user isn't premium, bounce to choose-plan
    if (requiresSub && (!user || !isPremium)) {
      router.replace("/choose-plan");
    }
  }, [loading, requiresSub, user, isPremium, router]);

  return null;
}
