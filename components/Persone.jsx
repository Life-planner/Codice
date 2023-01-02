import { useEffect, useState } from "react";
import styles from "../styles/persone.module.css";
import { toast } from "react-toastify";

import axios from "axios";

export default function Persone({
  persone,
  setPersone = (data) => {},
  blocked = false,
}) {
  const [add, setAdd] = useState("");
  const [soprannomi, setSoprannomi] = useState({});
  const [empty, setEmpty] = useState(true);

  const setId = (email) => {
    axios
      .get(`/api/user/email/${email}`)
      .then(function (response) {
        setPersone([...persone, response.data.userId]);

        let temp = soprannomi;
        temp[response.data.userId] = response.data.username;
        setSoprannomi({ ...temp });
      })
      .catch(function (error) {
        toast.error(
          "Untente cercato non esiste, inserire un email di un utente esistente"
        );
      });
  };

  const getSoprannome = (id) => {
    return (soprannomi[id] ??= id);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const addSoprannome = () => {
    persone.map((id) => {
      axios
        .get(`/api/user/userId/${id}`)
        .then(function (response) {
          let temp = soprannomi;
          temp[id] = response.data.username;
          setSoprannomi({ ...temp });
        })
        .catch(function (error) {
          toast.error(
            "Untente cercato non esiste, inserire un email di un utente esistente"
          );
        });
    });
  };

  useEffect(() => {
    addSoprannome();
  }, []);

  return (
    <div className={styles.container}>
      {persone.map((persona, id) => {
        return (
          <div className={styles.persone} key={persona + Math.random()}>
            {getSoprannome(persona)}
            {blocked ? null : (
              <span
                className="material-symbols-outlined"
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
            )}
          </div>
        );
      })}
      {blocked ? null : (
        <input
          type="text"
          value={add}
          className={styles.input}
          placeholder="Aggiungi persone (email)"
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              if (validateEmail(add)) {
                setId(add);
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
      )}
    </div>
  );
}
