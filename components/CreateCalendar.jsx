import { useState } from "react";
import styles from "../styles/createCalendar.module.css";
import FabButton from "./FabButton";
import IconText from "./IconText";
import Persone from "./Persone";
import { toast } from "react-toastify";
import { useUser } from "@auth0/nextjs-auth0/client";

import axios from "axios";

export default function CreateCalendar({
  full,
  close = () => {},
  refreshCalendari = () => {},
}) {
  const { user } = useUser();

  const [titolo, setTitolo] = useState("");
  const [persone, setPersone] = useState([]);
  const [color, setColor] = useState("#8338ec");
  const [textColor, setTextColor] = useState("#8338ec");
  const [gmt, setGmt] = useState(new Date().getTimezoneOffset() / -60);
  const [durata, setDurata] = useState(30);
  const [priorita, setPriorita] = useState(6);
  const [difficolta, setDifficolta] = useState(6);
  const [durataType, setDurataType] = useState("minuti");
  const [notTime, setNotTime] = useState(30);
  const [notType, setNotType] = useState("minuti");
  const [eTitolo, seteTitolo] = useState("");
  const [eDescrizione, seteDescrizione] = useState("");

  const getMins = (number, type) => {
    let temp = number;
    if (type == "secondi") temp = temp / 60;
    if (type == "ore") temp = temp * 60;
    if (type == "giorni") temp = temp * 1440;
    return temp;
  };

  const submit = () => {
    if (titolo === "") {
      toast.error("Devi inserire il nome del calendario!");
      return;
    }
    close();
    axios
      .post("/api/calendar", null, {
        params: {
          userId: user.sub,
          nome: titolo,
          fusoOrario: JSON.stringify({
            GMTOffset: gmt,
            localita: "rome",
          }),
          colore: color,
          principale: false,
          partecipanti: JSON.stringify([user.sub, ...persone]),
          impostazioniPredefiniteEventi: JSON.stringify({
            titolo: eTitolo,
            descrizione: eDescrizione,
            durata: getMins(durata, durataType),
            tempAnticNotifica: getMins(notTime, notType),
            luogo: {
              latitudine: "0.000000",
              longitudine: "0.000000",
            },
            priorita: priorita,
            difficolta: difficolta,
          }),
        },
      })
      .then(function () {
        toast.success("Calendario creato con successo");
        refreshCalendari();
      })
      .catch(function (error) {
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
      <div className={styles.title}>Crea Calendario</div>
      <div className={styles.line} />
      <div className={styles.small}>
        <input
          type="text"
          className={styles["input-title"]}
          placeholder="Aggiungi Nome Calendario"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
        />
        <div className={styles["line-small"]} />
        <div className={styles["main-info"]}>
          <IconText text="Persone" icon="groups" />
          <Persone persone={persone} setPersone={(data) => setPersone(data)} />
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
          <IconText text="Titolo" icon="title" />
          <input
            type="text"
            className={styles.input}
            placeholder="Aggiungi titolo eventi"
            value={eTitolo}
            onChange={(e) => {
              seteTitolo(e.target.value);
            }}
          />
          <IconText text="Descrizione" icon="description" />
          <input
            type="text"
            className={styles.input}
            placeholder="Aggiungi descrizione eventi"
            value={eDescrizione}
            onChange={(e) => {
              seteDescrizione(e.target.value);
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
      </div>
      <div className={styles.buttons}>
        <FabButton text="Annulla" icon="close" callback={() => close()} />
        <FabButton text="Salva" icon="done" primary callback={() => submit()} />
      </div>
    </div>
  );
}
