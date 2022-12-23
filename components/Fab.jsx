import { useState } from "react";
import styles from "../styles/fab.module.css";
import FabButton from "./FabButton";

export default function Fab({ openCalendar, openEvent }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className={styles.container}>
      <div className={styles.circle}>
        <span
          class={`material-symbols-outlined ${styles.transition} ${
            open ? styles.open : null
          }`}
          style={{ fontSize: "2rem" }}
          onClick={() => toggleOpen()}
        >
          add
        </span>
      </div>
      <div
        className={`${styles["button-container"]} ${
          open ? null : styles.closed
        }`}
      >
        <FabButton
          text="Calendario"
          icon="calendar_month"
          callback={() => {
            toggleOpen();
            openCalendar();
          }}
        />
        <FabButton
          text="Evento"
          icon="event"
          callback={() => {
            toggleOpen();
            openEvent();
          }}
        />
      </div>
    </div>
  );
}
