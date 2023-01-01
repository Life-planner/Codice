import { useState } from "react";
import styles from "../styles/createEvent.module.css";
import FabButton from "./FabButton";
import IconText from "./IconText";
import Persone from "./Persone";
import { toast } from "react-toastify";
import { useUser } from "@auth0/nextjs-auth0/client";

import axios from "axios";

// refresh evento aggiunto da fare

export default function CreateEvent({ full, close = () => {}, calendari }) {
  const getPrincipaleId = () => {
    const x = calendari.find(function (x) {
      if (x.nome === "Principale") return true;
    });
    return x._id;
  };
  const { user } = useUser();

  const [titolo, setTitolo] = useState("");
  const [persone, setPersone] = useState([]);
  const [data, setData] = useState("");
  const [durata, setDurata] = useState(30);
  const [durataType, setDurataType] = useState("minuti");
  const [priorita, setPriorita] = useState(6);
  const [difficolta, setDifficolta] = useState(6);
  const [calendario, setCalendario] = useState(getPrincipaleId());
  const [notTime, setNotTime] = useState(30);
  const [notType, setNotType] = useState("minuti");
  const [descrizione, setDescrizione] = useState("");

  const getNotificationDate = () => {
    let date = new Date(data);
    date.setSeconds(0, 0);
    let offset = notTime * 1000;
    if (notType === "minuti") offset *= 60;
    if (notType === "ore") offset *= 3600;
    if (notType === "giorni") offset *= 86400;

    return (date.getTime - offset) / 1000;
  };

  const submit = () => {
    if (titolo === "") {
      toast.error("Devi inserire il titolo!");
      return;
    }
    if (data === "") {
      toast.error("Devi inserire una data!");
      return;
    }
    close();
    axios
      .post("/api/event", null, {
        params: {
          userId: user.sub,
          IDCalendario: calendario,
          titolo: titolo,
          descrizione: descrizione,
          priorita: priorita,
          difficolta: difficolta,
          partecipanti: [user.sub, ...persone],
          notifiche: { titolo: titolo, data: [getNotificationDate()] },
          durata: durata,
          isEventoSingolo: true,
          eventoSingolo: { data: data, isScadenza: true },
        },
      })
      .then(function (response) {
        toast.success("Evento creato con successo");
        // aggiorno eventi
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Errore nel creare il calendario");
      });
  };

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
          value={titolo}
          onChange={(e) => {
            setTitolo(e.target.value);
          }}
        />
        <div className={styles["line-small"]} />
        <div className={styles["main-info"]}>
          <IconText text="Data" icon="edit_calendar" />
          <input
            type="datetime-local"
            className={styles.input}
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <IconText text="Durata" icon="hourglass_empty" />
          <div className={styles.flex}>
            <input
              type="number"
              defaultValue="30"
              min="0"
              placeholder="30"
              className={styles.mins}
              value={durata}
              onChange={(e) => {
                setDurata(e.target.value);
              }}
            />
            <select
              name="time"
              id="duration"
              className={styles.select}
              value={durataType}
              onChange={(e) => {
                setDurataType(e.target.value);
              }}
            >
              <option value="minuti">Min</option>
              <option value="ore">Ore</option>
            </select>
          </div>
          <IconText text="Persone" icon="groups" />
          <Persone persone={persone} setPersone={(data) => setPersone(data)} />
          <IconText text="Priorità" icon="bolt" />
          <input
            type="number"
            defaultValue="6"
            min="1"
            max="10"
            placeholder="6"
            className={styles.mins}
            value={priorita}
            onChange={(e) => {
              setPriorita(e.target.value);
            }}
          />
          <IconText text="Difficoltà" icon="battery_5_bar" />
          <input
            type="number"
            defaultValue="6"
            min="1"
            max="10"
            placeholder="6"
            className={styles.mins}
            value={difficolta}
            onChange={(e) => {
              setDifficolta(e.target.value);
            }}
          />
          <IconText text="Luogo" icon="pin_drop" />
          <input
            disabled
            type="text"
            className={`${styles.input} ${styles.disabled}`}
            placeholder="Aggiungi luogo"
          />
          <IconText
            text="Calendario"
            icon="event_note"
            value={calendario}
            onChange={(e) => {
              setCalendario(e.target.value);
            }}
          />
          <select name="time" id="duration" className={styles.select}>
            {calendari.map((element) => {
              return <option value={element._id}>{element.nome}</option>;
            })}
          </select>
          <IconText text="Notifiche" icon="notifications" />
          <div className={styles.flex}>
            <input
              type="number"
              defaultValue="30"
              min="0"
              placeholder="30"
              className={styles.mins}
              value={notTime}
              onChange={(e) => {
                setNotTime(e.target.value);
              }}
            />
            <select
              name="time"
              id="duration"
              className={styles.select}
              value={notType}
              onChange={(e) => {
                setNotType(e.target.value);
              }}
            >
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
          value={descrizione}
          onChange={(e) => {
            setDescrizione(e.target.value);
          }}
        />
      </div>
      <div className={styles.buttons}>
        <FabButton text="Annulla" icon="close" callback={() => close()} />
        <FabButton text="Salva" icon="done" primary callback={() => submit()} />
      </div>
    </div>
  );
}
