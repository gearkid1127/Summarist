"use client";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/");
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <Link href="/" className="nav__img--mask">
        <img className="nav__img" src="/assets/logo.png" alt="logo" />
      </Link>
      {/* Group 1 */}
      <div className={`${styles.group} ${styles.group1}`}>
        <div className={styles.linkWrapper}>
          <div
            className={`${styles.link__tab} ${
              pathname === "/for-you" ? styles.active : ""
            }`}
          ></div>
          <div className={styles.linkIconWrapper}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
            </svg>
          </div>
          <Link className={styles.item} href="/for-you">
            For you
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <div
            className={`${styles.link__tab} ${
              pathname === "/library" ? styles.active : ""
            }`}
          ></div>
          <div className={styles.linkIconWrapper}></div>
          <Link className={styles.item} href="/library">
            My Library
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <div className={styles.link__tab}></div>
          <div className={styles.linkIconWrapper}></div>{" "}
          <Link className={styles.item} href="/highlights">
            Highlights
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <div className={styles.link__tab}></div>
          <div className={styles.linkIconWrapper}></div>
          <Link className={styles.item} href="/search">
            Search
          </Link>
        </div>
      </div>

      {/* Group 2 */}
      <div className={styles.group}>
        <div className={styles.linkWrapper}>
          <div
            className={`${styles.link__tab} ${
              pathname === "/settings" ? styles.active : ""
            }`}
          ></div>
          <div className={styles.linkIconWrapper}></div>
          <Link className={styles.item} href="/settings">
            Settings
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <div className={styles.link__tab}></div>
          <div className={styles.linkIconWrapper}></div>{" "}
          <Link className={styles.item} href="/help">
            Help & Support
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <div className={styles.link__tab}></div>
          <div className={styles.linkIconWrapper}></div>
          <Link onClick={handleLogout} className={styles.item} href="/logout">
            Logout
          </Link>
        </div>
      </div>
      {/* optional close button inside sidebar (mobile only) */}
      <button
        type="button"
        className={styles.closeBtn}
        aria-label="Close sidebar"
        onClick={onClose}
      >
        ✕
      </button>

      {/* ...your links */}
    </aside>
  );
}
