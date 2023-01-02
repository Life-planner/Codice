import Link from "next/link";

import styles from "../styles/button.module.css";

export default function LoginButton() {
  return (
    <a
      className={`${styles.container} ${styles.primary}`}
      href="/api/auth/login"
    >
      Login
    </a>
  );
}
