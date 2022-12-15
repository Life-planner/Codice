import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import styles from "../styles/calendario.module.css";
import Menu from "../components/Menu";
import CalendarMenu from "../components/calendarMenu";

export default withPageAuthRequired(function Calendario() {
  return (
    <div className="">
      <Head>
        <title>Calendario</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className={styles.home}>
        <Menu selected="Calendario" />
        <div className={styles.content}>
          <CalendarMenu />
          <div className={styles.calendario}>
            <div className={styles.wrapper}>
              <div
                style={{
                  width: "200rem",
                  height: "200rem",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
