import Link from "next/link";

import styles from "../styles/resizeButton.module.css";

export default function ResizeButton({ text, icon = "", callback = () => {} }) {
  return (
    <div className={styles.container}>
      {text}
      {icon === "" ? (
        ""
      ) : (
        <span class="material-symbols-outlined" style={{ fontSize: "20px" }}>
          {icon}
        </span>
      )}
    </div>
  );
}
