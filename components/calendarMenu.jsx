import styles from "../styles/calendarMenu.module.css";
import ResizeButton from "./ResizeButton";

export default function CalendarMenu() {
  return (
    <div className={styles.container}>
      <ResizeButton text="Oggi" icon="event" />
      <div className={styles.arrows}>
        <ResizeButton icon="chevron_left" />
        <ResizeButton icon="chevron_right" />
      </div>
      <ResizeButton text="Dicembre 2022" />
      <div style={{ marginRight: "auto" }}></div>
      <ResizeButton text="Settimana" icon="expand_more" />
      <ResizeButton text="Condividi" icon="share" />
      <ResizeButton text="Calendari" icon="event_note" />
    </div>
  );
}
