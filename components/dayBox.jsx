import styles from "../styles/dayBox.module.css";

const day = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];

export default function DayBox({ index, dayNumber, selected = false }) {
  return (
    <div
      className={`${styles.container} ${
        selected ? styles["bcg-selected"] : null
      }`}
    >
      <div className={`${styles.text} ${selected ? styles.selected : null}`}>
        {day[index]}
      </div>
      <div className={`${styles.number} ${selected ? styles.selected : null}`}>
        {dayNumber}
      </div>
    </div>
  );
}
