import { useState } from "react";
import styles from "../styles/persone.module.css";

export default function Persone({ personeArray = [] }) {
  const [persone, setPersone] = useState(personeArray);
  const [add, setAdd] = useState("");

  return (
    <div className={styles.container}>
      {persone.map((persona, id) => {
        return (
          <div className={styles.persone} key={persona + Math.random()}>
            {persona}
            <span
              class="material-symbols-outlined"
              style={{
                fontSize: "1rem",
                fontWeight: "700",
              }}
              onClick={() => {
                persone.splice(id, 1);
                setPersone([...persone]);
              }}
            >
              close
            </span>
          </div>
        );
      })}
      <input
        type="text"
        value={add}
        className={styles.input}
        placeholder="Aggiungi persone"
        onChange={(e) => {
          setAdd(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            setPersone([...persone, add]);
            setAdd("");
          }
          if (e.code === "Backspace" && add === "") {
            setPersone(persone.slice(0, -1));
          }
        }}
      />
    </div>
  );
}
