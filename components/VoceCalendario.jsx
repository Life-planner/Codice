import { useState } from "react";
import styles from "../styles/voceCalendario.module.css";
import IconText from "./IconText";

export default function VoceCalendario({
  calendario,
  eventi = [],
  openCalendario = () => {},
  openEvento = () => {},
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "1.25rem", cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? "keyboard_arrow_down" : "keyboard_arrow_right"}
        </span>
        <div
          className={styles.name}
          onClick={() => {
            openCalendario();
          }}
        >
          {calendario.nome}
        </div>
      </div>
      {open ? (
        <div className={styles["event-wrapper"]}>
          {eventi.map((element) => {
            console.log(element);
            return (
              <div
                className={styles["event-container"]}
                key={"evento" + element._id}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.99998 9.66665C8.46665 9.66665 8.86109 9.50554 9.18331 9.18331C9.50554 8.86109 9.66665 8.46665 9.66665 7.99998C9.66665 7.53331 9.50554 7.13887 9.18331 6.81665C8.86109 6.49442 8.46665 6.33331 7.99998 6.33331C7.53331 6.33331 7.13887 6.49442 6.81665 6.81665C6.49442 7.13887 6.33331 7.53331 6.33331 7.99998C6.33331 8.46665 6.49442 8.86109 6.81665 9.18331C7.13887 9.50554 7.53331 9.66665 7.99998 9.66665Z"
                    fill="black"
                  />
                </svg>
                {element.titolo}
              </div>
            );
          })}{" "}
        </div>
      ) : null}
    </div>
  );
}
