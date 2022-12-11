import styles from "../styles/container.module.css";

export default function Container({ children, type }) {
  return (
    <div className={type === "large" ? styles.large : styles.small}>
      {children}
    </div>
  );
}
