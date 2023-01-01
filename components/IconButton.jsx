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
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1.625rem" }}
      >
        {icon}
      </span>
      {text}
    </Link>
  );
}
