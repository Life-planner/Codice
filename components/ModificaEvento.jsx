import { useEffect, useState } from "react";
import styles from "../styles/createEvent.module.css";
import FabButton from "./FabButton";
import IconText from "./IconText";
import Persone from "./Persone";
import { toast } from "react-toastify";
import { useUser } from "@auth0/nextjs-auth0/client";

import axios from "axios";

// refresh evento aggiunto da fare

export default function ModificaEvento({
  evento,
  full,
  close = () => {},
  calendari,
  refreshEvento = (id) => {
    id;
  },
}) {
  const { user } = useUser();

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

  useEffect(() => {
    setTitolo(evento.titolo);
    setPersone(removeFirst(evento.partecipanti));
    setData(evento.eventoSingolo.data);
    setDurata(evento.durata);
    setDurataType("minuti");
    setPriorita(evento.priorita);
    setDifficolta(evento.difficolta);
    setCalendario(evento.IDCalendario);
    setNotTime(
      getNotificationReverse(
        evento.notifiche.data[0],
        evento.eventoSingolo.data
      )
    );
    setNotType("minuti");
    setDescrizione(evento.descrizione);
  }, [evento]);

  const getNotificationDate = () => {
    let date = new Date(data);
    date.setSeconds(0, 0);
    let offset = notTime * 1000;
    if (notType === "minuti") offset *= 60;
    if (notType === "ore") offset *= 3600;
    if (notType === "giorni") offset *= 86400;

    return date.getTime() - offset;
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
      .put("/api/event", null, {
        params: {
          userId: user.sub,
          IDEvento: evento._id,
          IDCalendario: calendario,
          titolo: titolo,
          descrizione: descrizione,
          priorita: priorita,
          difficolta: difficolta,
          partecipanti: JSON.stringify([user.sub, ...persone]),
          notifiche: JSON.stringify({
            titolo: titolo,
            data: [getNotificationDate()],
          }),
          luogo: JSON.stringify({
            latitudine: "0.000000",
            longitudine: "0.000000",
          }),
          durata: durata,
          isEventoSingolo: true,
          eventoSingolo: JSON.stringify({ data: data, isScadenza: true }),
        },
      })
      .then(function (response) {
        toast.success("Evento modificato con successo");
        setTimeout(() => {
          if (calendario != evento.IDCalendario) {
            refreshEvento(evento.IDCalendario);
          }
          refreshEvento(calendario);
        }, 100);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Errore nel modificare l'evento");
      });
  };

  const elimina = () => {
    close();
    axios
      .delete("/api/event", {
        params: {
          userId: user.sub,
          IDEvento: evento._id,
        },
      })
      .then(function (response) {
        toast.success("Evento eliminato con successo");
        refreshEvento(calendario);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Errore nell eliminare l'evento");
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
      <div className={styles.title}>Modifica Evento</div>
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
            defaultValue={new Date(evento.eventoSingolo.data)
              .toISOString()
              .substring(0, 16)}
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <IconText text="Durata" icon="hourglass_empty" />
          <div className={styles.flex}>
            <input
              type="number"
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
          <select
            name="time"
            id="duration"
            className={styles.select}
            value={calendario}
            onChange={(e) => {
              setCalendario(e.target.value);
            }}
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
              type="number"
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
              <option value="minuti">Minuti</option>
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
        <FabButton text="Elimina" icon="delete" callback={() => elimina()} />
        <FabButton text="Annulla" icon="close" callback={() => close()} />
        <FabButton text="Salva" icon="done" primary callback={() => submit()} />
      </div>
    </div>
  );
}
