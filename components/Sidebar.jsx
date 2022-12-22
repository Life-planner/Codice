import styles from "../styles/sidebar.module.css";
import CheckCalendar from "./CheckCalendar";
import ResizeButton from "./ResizeButton";

export default function Sidebar({ show, closeSidebar }) {
  return (
    <div
      className={styles.container}
      style={show ? null : { transform: "translateX(100%)" }}
    >
      <div className={styles.box}>
        <ResizeButton
          text="Chiudi"
          icon="keyboard_double_arrow_right"
          callback={() => closeSidebar()}
        />
        <div className={styles.line}></div>
        <CheckCalendar text="Principale" />
        <CheckCalendar text="PlanIt" color="#3a86ff" selected />
        <CheckCalendar text="Fab Lab" color="#8338ec" selected />
        <CheckCalendar text="Lavoro" color="#ff006e" shared />
        <CheckCalendar text="Lezioni" color="#fb5607" shared selected />
      </div>
    </div>
  );
}
