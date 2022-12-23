import { useState } from "react";
import styles from "../styles/createEvent.module.css";
import FabButton from "./FabButton";
import IconText from "./IconText";

export default function CreateEvent({ full, close = () => {} }) {
  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={full ? { width: "100%", height: "100%" } : null}
    >
      <div className={styles.title}>Crea Evento</div>
      <div className={styles.line} />
      <div className={styles.small}>
        <input
          type="text"
          className={styles["input-title"]}
          placeholder="Aggiungi Titolo Evento"
        />
        <div className={styles["line-small"]} />
        <div className={styles["main-info"]}>
          <IconText text="Data" icon="edit_calendar" />
          <div className=""></div>
          <IconText text="Durata" icon="hourglass_empty" />
          <div className={styles.flex}>
            <input
              type="number"
              defaultValue="30"
              min="0"
              placeholder="30"
              className={styles.mins}
            />
            <select name="time" id="duration" className={styles.select}>
              <option value="minuti">Min</option>
              <option value="ore">Ore</option>
            </select>
          </div>
          <IconText text="Priorità" icon="bolt" />
          <input
            type="number"
            defaultValue="6"
            min="1"
            max="10"
            placeholder="6"
            className={styles.mins}
          />
          <IconText text="Difficoltà" icon="battery_5_bar" />
          <input
            type="number"
            defaultValue="6"
            min="1"
            max="10"
            placeholder="6"
            className={styles.mins}
          />
          <IconText text="Luogo" icon="pin_drop" />
          <input
            disabled
            type="text"
            className={`${styles.input} ${styles.disabled}`}
            placeholder="Aggiungi luogo"
          />
          <IconText text="Calendario" icon="event_note" />
          <select name="time" id="duration" className={styles.select}>
            <option value="principale">Principale</option>
            <option value="fablab">Fablab</option>
            <option value="lezioni">Lezioni</option>
            <option value="Lavoro">Lavoro</option>
          </select>
          <IconText text="Notifiche" icon="notifications" />
          <div className={styles.flex}>
            <input
              type="number"
              defaultValue="30"
              min="0"
              placeholder="30"
              className={styles.mins}
            />
            <select name="time" id="duration" className={styles.select}>
              <option value="secondi">Secondi</option>
              <option value="minuti" selected="selected">
                Minuti
              </option>
              <option value="ore">Ore</option>
              <option value="giorni">Giorni</option>
            </select>
            <div className={styles.text}>Prima</div>
          </div>
        </div>
        <div className={styles["line-small"]} />
        <textarea
          className={styles.textarea}
          rows="3"
          placeholder="Aggiungi descrizione dell'evento"
        />
      </div>
      <div className={styles.buttons}>
        <FabButton text="Annulla" icon="close" callback={() => close()} />
        <FabButton text="Salva" icon="done" primary callback={() => close()} />
      </div>
    </div>
  );
}
