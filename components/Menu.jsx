import Link from "next/link";
import Image from "next/image";

import styles from "../styles/menu.module.css";
import IconButton from "./IconButton";

export default function Menu({ selected }) {
  return (
    <div className={styles.container}>
      <Link href={"/"} className={styles.logo}>
        <Image src={"/assets/logo.svg"} height="50" width="150" alt="Logo" />
      </Link>
      <div className={styles.line}></div>
      <div className={styles["button-container"]}>
        <IconButton
          text="Calendario"
          link="calendario"
          icon="calendar_month"
          selected={selected == "Calendario"}
        />
        <IconButton
          text="Dashboard"
          link="dashboard"
          icon="insert_chart"
          selected={selected == "Dashboard"}
        />
        <IconButton
          text="Attività"
          link="attivita"
          icon="edit_calendar"
          selected={selected == "Attività"}
        />
        <IconButton
          text="Eventi"
          link="eventi"
          icon="ballot"
          selected={selected == "Eventi"}
        />
        <IconButton
          text="Account"
          link="account"
          icon="person"
          selected={selected == "Account"}
        />
      </div>
    </div>
  );
}
