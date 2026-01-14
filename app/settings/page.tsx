"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import styles from "./page.module.css";
import { useDispatch } from "react-redux";
import { openLogin } from "@/redux/authModalSlice";

export default function SettingsPage() {
  const { user, loading, isPremium } = useAuth();
  const dispatch = useDispatch();

  if (loading) return null; // or a spinner if you want

  // Not logged in UI (matches assignment)
  if (!user) {
    return (
      <div className={styles.settings}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.loginCard}>
          <img
            className={styles.loginImage}
            src="/assets/login.png"
            alt="Login required"
          />
          <div className={styles.loginText}>
            Log in to your account to see your details.
          </div>
          <button
            type="button"
            className={styles.loginBtn}
            onClick={() => dispatch(openLogin())}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Logged in UI
  const planLabel = isPremium ? "premium" : "Basic";

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Your Subscription plan</div>

        {!isPremium ? (
          <>
            <div className={styles.value}>{planLabel}</div>
            <hr className={styles.divider} />
            <Link href="/choose-plan">
              <button className={styles.upgradeBtn}>Upgrade to Premium</button>
            </Link>
          </>
        ) : (
          <div className={styles.value}>{planLabel}</div>
        )}

        <hr className={styles.divider} />

        <div className={styles.sectionTitle}>Email</div>
        <div className={styles.value}>{user.email ?? "No email found"}</div>
      </div>
    </div>
  );
}
