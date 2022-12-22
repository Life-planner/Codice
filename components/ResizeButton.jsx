import styles from "../styles/resizeButton.module.css";

export default function ResizeButton({ text, icon = "", callback = () => {} }) {
  return (
    <div className={styles.container} onClick={() => callback()}>
      {text}
      {icon === "" ? (
        ""
      ) : (
        <span class="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
          {icon}
        </span>
      )}
    </div>
  );
}
