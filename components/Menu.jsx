import Link from "next/link";
import Image from "next/image";

import styles from "../styles/menu.module.css";

export default function Menu() {
  return (
    <div className={styles.container}>
      <Link href={"/"} className={styles.logo}>
        <Image src={"/assets/logo.svg"} height="50" width="150" />
      </Link>
      <div className={styles.line}></div>
      <div className={styles["button-container"]}></div>
    </div>
  );
}
