import Image from "next/image";

import styles from "../styles/navbar.module.css";
import Button from "./Button";
import LoginButton from "./LoginButton";

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
      <LoginButton />
    </div>
  );
}
