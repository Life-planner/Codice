import Link from "next/link";

import styles from "../styles/iconButton.module.css";

export default function IconButton({
  text,
  icon = "",
  link = "",
  selected = false,
}) {
  return (
    <Link
      href={`/${link}`}
      className={`${styles.container} ${
        selected ? styles.selected : styles.primary
      }`}
    >
      <span class="material-symbols-outlined">{icon}</span>
      {text}
    </Link>
  );
}
