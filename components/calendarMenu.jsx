import styles from "../styles/calendarMenu.module.css";
import ResizeButton from "./ResizeButton";

export default function CalendarMenu({
  firstDay,
  prevWeek,
  goToday,
  nextWeek,
  openSidebar,
}) {
  return (
    <div className={styles.container}>
      <ResizeButton text="Oggi" icon="event" callback={() => goToday()} />
      <div className={styles.arrows}>
        <ResizeButton icon="chevron_left" callback={() => prevWeek()} />
        <ResizeButton icon="chevron_right" callback={() => nextWeek()} />
      </div>
      <ResizeButton
        text={`${firstDay.toLocaleString("default", {
          month: "long",
        })} ${firstDay.getFullYear()}`}
      />
      <div style={{ marginRight: "auto" }}></div>
      <ResizeButton text="Settimana" icon="expand_more" />
      <ResizeButton text="Condividi" icon="share" />
      <ResizeButton
        text="Calendari"
        icon="event_note"
        callback={() => openSidebar()}
      />
    </div>
  );
}
