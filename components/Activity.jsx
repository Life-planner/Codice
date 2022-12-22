import styles from "../styles/activity.module.css";

export default function Activity({
  start,
  duration,
  title,
  color = "#3A86FF",
  calendar = false,
  callback = (id) => {},
}) {
  return (
    <div
      className={styles.container}
      style={{
        marginTop: `${(start * 144) / 1440}rem`,
        height: `${(duration * 144) / 1440}rem`,
        backgroundColor: color,
      }}
    >
      {calendar ? <div className={styles.calendar}>{calendar}</div> : null}
      <div className={styles.title}>{title}</div>
    </div>
  );
}
