import styles from "../styles/iconText.module.css";

export default function IconText({ text, icon }) {
  return (
    <div className={styles.container}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1.25rem" }}
      >
        {icon}
      </span>
      {text}
    </div>
  );
}
