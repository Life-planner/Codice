import { useState } from "react";
import styles from "../styles/createCalendar.module.css";
import FabButton from "./FabButton";
import IconText from "./IconText";

export default function CreateCalendar({ full, close = () => {} }) {
  const [color, setColor] = useState("#8338ec");
  const [textColor, setTextColor] = useState("#8338ec");
  const [gmt, setGmt] = useState(new Date().getTimezoneOffset() / -60);
  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={full ? { width: "100%", height: "100%" } : null}
    >
      <div className={styles.title}>Crea Calendario</div>
      <div className={styles.line} />
      <div className={styles.small}>
        <input
          type="text"
          className={styles["input-title"]}
          placeholder="Aggiungi Nome Calendario"
        />
        <div className={styles["line-small"]} />
        <div className={styles["main-info"]}>
          <IconText text="Persone" icon="groups" />
          <input
            disabled
            type="text"
            className={`${styles.input} ${styles.disabled}`}
            placeholder="Aggiungi persone"
          />
          <IconText text="Colore" icon="palette" />
          <div className={styles.color}>
            <input
              type="color"
              className={styles.input}
              placeholder="Aggiungi persone"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setTextColor(e.target.value);
              }}
            />
            <input
              type="text"
              value={textColor.toUpperCase()}
              className={styles["color-text"]}
              pattern="[0-9a-f]{6}"
              onChange={(e) => {
                setTextColor(e.target.value);
                if (e.target.value.match(/^#[0-9a-f]{6}$/i)) {
                  setColor(e.target.value);
                }
              }}
            ></input>
          </div>
          <IconText text="Fuso orario" icon="manage_history" />
          <div className={styles.gmt}>
            <div className={styles.text}>GMT</div>
            <input
              type="text"
              className={styles.input}
              value={(gmt >= 0 && gmt <= 13 && gmt != "" ? "+" : "") + gmt}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  e.target.value === "-" ||
                  e.target.value === "+"
                ) {
                  setGmt(e.target.value);
                  return;
                }
                let number = parseInt(e.target.value);
                if (number >= -12 && number <= 13) {
                  setGmt(number);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.line} />
      <div className={styles.small}>
        <div className={styles["section-title"]}>
          Impostazioni predefinite degli eventi
        </div>
        <div className={styles["main-info"]}>
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
      </div>
      <div className={styles.buttons}>
        <FabButton text="Annulla" icon="close" callback={() => close()} />
        <FabButton text="Salva" icon="done" primary callback={() => close()} />
      </div>
    </div>
  );
}
