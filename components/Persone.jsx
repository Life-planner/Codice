import { useState } from "react";
import styles from "../styles/persone.module.css";
import { toast } from "react-toastify";

import axios from "axios";

export default function Persone({ persone, setPersone = (data) => {} }) {
  const [add, setAdd] = useState("");
  const [soprannomi, setSoprannomi] = useState({});
  const [empty, setEmpty] = useState(true);

  const getSoprannome = (email) => {
    return (soprannomi[email] ??= email);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const addSoprannome = (email) => {
    axios
      .get(`/api/user/email/${email}`)
      .then(function (response) {
        let temp = soprannomi;
        console.log(JSON.stringify(temp));
        temp[email] = response.data.username;
        console.log(JSON.stringify(temp));
        setSoprannomi({ ...temp });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      {persone.map((persona, id) => {
        return (
          <div className={styles.persone} key={persona + Math.random()}>
            {getSoprannome(persona)}
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
        placeholder="Aggiungi persone (email)"
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            if (validateEmail(add)) {
              setPersone([...persone, add]);
              addSoprannome(add);
              setAdd("");
              setEmpty(true);
            } else {
              toast.error("Invalid email");
            }
          }
          if (e.code === "Backspace") {
            if (empty) setPersone(persone.slice(0, -1));
            setEmpty(add === "");
          }
        }}
        onChange={(e) => {
          setEmpty(false);
          setAdd(e.target.value);
        }}
      />
    </div>
  );
}
