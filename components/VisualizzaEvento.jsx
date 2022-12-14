import { useState } from "react";
import styles from "../styles/createEvent.module.css";
import FabButton from "./FabButton";
import IconText from "./IconText";
import Persone from "./Persone";

export default function VisualizzaEvento({
  evento,
  full,
  close = () => {},
  calendari,
}) {
  const removeFirst = (array) => {
    let [, ...temp] = array;
    return temp;
  };

  const getNotificationReverse = (data1, data2) => {
    let date1 = new Date(data1);
    let date2 = new Date(data2);

    return (date2 - date1) / 60000;
  };

  const [titolo, setTitolo] = useState(evento.titolo);
  const [persone, setPersone] = useState(removeFirst(evento.partecipanti));
  const [data, setData] = useState(evento.eventoSingolo.data);
  const [durata, setDurata] = useState(evento.durata);
  const [durataType, setDurataType] = useState("minuti");
  const [priorita, setPriorita] = useState(evento.priorita);
  const [difficolta, setDifficolta] = useState(evento.difficolta);
  const [calendario, setCalendario] = useState(evento.IDCalendario);
  const [notTime, setNotTime] = useState(
    getNotificationReverse(evento.notifiche.data[0], evento.eventoSingolo.data)
  );
  const [notType, setNotType] = useState("minuti");
  const [descrizione, setDescrizione] = useState(evento.descrizione);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={full ? { width: "100%", height: "100%" } : null}
    >
      <div className={styles.title}>Visualizza Evento</div>
      <div className={styles.line} />
      <div className={styles.small}>
        <input
          readOnly
          type="text"
          className={styles["input-title"]}
          placeholder="Aggiungi Titolo Evento"
          value={titolo}
        />
        <div className={styles["line-small"]} />
        <div className={styles["main-info"]}>
          <IconText text="Data" icon="edit_calendar" />
          <input
            readOnly
            disabled
            type="datetime-local"
            className={styles.input}
            defaultValue={new Date(evento.eventoSingolo.data)
              .toISOString()
              .substring(0, 16)}
          />
          <IconText text="Durata" icon="hourglass_empty" />
          <div className={styles.flex}>
            <input
              readOnly
              disabled
              type="number"
              min="0"
              placeholder="30"
              className={styles.mins}
              value={durata}
            />
            <select
              readOnly
              disabled
              name="time"
              id="duration"
              className={styles.select}
              value={durataType}
            >
              <option value="minuti">Min</option>
              <option value="ore">Ore</option>
            </select>
          </div>
          <IconText text="Persone" icon="groups" />
          <Persone
            persone={persone}
            setPersone={(data) => setPersone(data)}
            blocked
          />
          <IconText text="Priorit??" icon="bolt" />
          <input
            readOnly
            disabled
            type="number"
            min="1"
            max="10"
            placeholder="6"
            className={styles.mins}
            value={priorita}
          />
          <IconText text="Difficolt??" icon="battery_5_bar" />
          <input
            readOnly
            disabled
            type="number"
            min="1"
            max="10"
            placeholder="6"
            className={styles.mins}
            value={difficolta}
          />
          <IconText text="Luogo" icon="pin_drop" />
          <input
            readOnly
            disabled
            type="text"
            className={`${styles.input} ${styles.disabled}`}
          />
          <IconText text="Calendario" icon="event_note" value={calendario} />
          <select
            readOnly
            disabled
            name="time"
            id="duration"
            className={styles.select}
            value={calendario}
          >
            {calendari.map((element) => {
              return (
                <option value={element._id} key={"option" + element._id}>
                  {element.nome}
                </option>
              );
            })}
          </select>
          <IconText text="Notifiche" icon="notifications" />
          <div className={styles.flex}>
            <input
              readOnly
              disabled
              type="number"
              min="0"
              placeholder="30"
              className={styles.mins}
              value={notTime}
            />
            <select
              readOnly
              disabled
              name="time"
              id="duration"
              className={styles.select}
              value={notType}
            >
              <option value="secondi">Secondi</option>
              <option value="minuti">Minuti</option>
              <option value="ore">Ore</option>
              <option value="giorni">Giorni</option>
            </select>
            <div className={styles.text}>Prima</div>
          </div>
        </div>
        <div className={styles["line-small"]} />
        <textarea
          readOnly
          disabled
          className={styles.textarea}
          rows="3"
          value={descrizione}
        />
      </div>
      <div className={styles.buttons}>
        <FabButton text="Chiudi" icon="close" callback={() => close()} />
      </div>
    </div>
  );
}
