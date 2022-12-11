import Image from "next/image";

import styles from "../styles/navbar.module.css";
import Button from "./Button";

export default function Navbar() {
  return (
    <div className={styles.container}>
      <Image
        src={"/assets/logoPurple.svg"}
        width="150"
        height="50"
        className={styles.logo}
      />
      <Button text="Try Demo" type="secondary" />
      <Button text="Login" type="primary" link="calendario" />
    </div>
  );
}
