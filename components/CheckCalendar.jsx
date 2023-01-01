import styles from "../styles/checkCalendar.module.css";

export default function CheckCalendar({
  text,
  deselect = false,
  color = "#IEIEIE",
  index,
  shared = false,
  callback = (id) => {},
}) {
  return (
    <div className={styles.container} onClick={() => callback(index)}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1.5rem", color: color, cursor: "pointer" }}
      >
        {deselect ? "check_box_outline_blank" : "check_box"}
      </span>
      {text}
      {shared ? (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "1.125rem", color: "var(--black-50)" }}
        >
          group
        </span>
      ) : null}
    </div>
  );
}
