import styles from "../styles/hour.module.css";

export default function Hour({ index }) {
  if (index === 0) return null;
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {(index > 12 ? index - 12 : index) + " " + (index < 12 ? "AM" : "PM")}
      </div>
    </div>
  );
}
