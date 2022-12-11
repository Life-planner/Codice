import Link from "next/link";

import styles from "../styles/button.module.css";

export default function Button({ text, link = "", type = "primary" }) {
  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <Link href={`/${link}`}>{text}</Link>
    </div>
  );
}
