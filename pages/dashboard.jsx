import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import styles from "../styles/dashboard.module.css";
import Menu from "../components/Menu";

export default withPageAuthRequired(function Dashboard() {
  return (
    <div className="">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className={styles.home}>
        <Menu selected="Dashboard" />
      </div>
    </div>
  );
});
