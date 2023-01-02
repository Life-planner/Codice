import { isTemplateSpan } from "typescript";
import styles from "../styles/sidebar.module.css";
import CheckCalendar from "./CheckCalendar";
import ResizeButton from "./ResizeButton";

export default function Sidebar({
  show,
  closeSidebar,
  calendari,
  checkCalendari = (id) => {},
}) {
  return (
    <div
      className={styles.container}
      style={show ? null : { transform: "translateX(100%)" }}
    >
      <div className={styles.box}>
        <ResizeButton
          text="Chiudi"
          icon="keyboard_double_arrow_right"
          callback={() => closeSidebar()}
        />
        <div className={styles.line}></div>
        {calendari?.map((element, index) => {
          return (
            <CheckCalendar
              text={element.nome}
              color={element.colore}
              index={index}
              deselect={element.deselect}
              callback={(id) => {
                checkCalendari(id);
              }}
              key={element._id}
              shared={element.partecipanti.length > 1}
            />
          );
        })}
      </div>
    </div>
  );
}
