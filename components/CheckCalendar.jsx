import styles from "../styles/checkCalendar.module.css";

export default function CheckCalendar({
  text,
  selected,
  color = "#IEIEIE",
  shared = false,
  callback = (id) => {},
}) {
  return (
    <div className={styles.container} onClick={() => callback()}>
      <span
        class="material-symbols-outlined"
        style={{ fontSize: "1.5rem", color: color, cursor: "pointer" }}
      >
        {selected ? "check_box" : "check_box_outline_blank"}
      </span>
      {text}
      {shared ? (
        <span
          class="material-symbols-outlined"
          style={{ fontSize: "1.125rem", color: "var(--black-50)" }}
        >
          group
        </span>
      ) : null}
    </div>
  );
}
