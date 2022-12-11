import Link from "next/link";

import styles from "../styles/button.module.css";

export default function LoginButton() {
  return (
    <div className={`${styles.container} ${styles.primary}`}>
      <a href="/api/auth/login">Login</a>
    </div>
  );
}
