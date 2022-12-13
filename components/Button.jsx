import Link from "next/link";

import styles from "../styles/button.module.css";

export default function Button({ text, link = "", type = "primary" }) {
  return (
    <Link href={`/${link}`} className={`${styles.container} ${styles[type]}`}>
      {text}
    </Link>
  );
}
