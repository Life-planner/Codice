import styles from "../styles/fabButton.module.css";

export default function FabButton({
  text,
  icon = "",
  primary = false,
  callback = () => {},
}) {
  return (
    <div
      className={`${styles.container} ${
        primary ? styles.primary : styles.outline
      }`}
      onClick={() => {
        close();
        callback();
      }}
    >
      {text}
      {icon === "" ? (
        ""
      ) : (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "1.25rem" }}
        >
          {icon}
        </span>
      )}
    </div>
  );
}
