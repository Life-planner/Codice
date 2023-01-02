import Head from "next/head";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useEffect, useState } from "react";

import styles from "../styles/eventi.module.css";
import Menu from "../components/Menu";
import ResizeButton from "../components/ResizeButton";
import VoceCalendario from "../components/VoceCalendario";
import CreateCalendar from "../components/CreateCalendar";
import CreateEvent from "../components/CreaEvento";
import ModificaCalendario from "../components/ModificaCalendario";
import ModificaEvento from "../components/ModificaEvento";

export default withPageAuthRequired(function Eventi() {
  const [calendari, setCalendari] = useState([]);
  const [eventi, setEventi] = useState({});
  const [right, setRight] = useState("empty");
  const [calendario, setCalendario] = useState({});
  const [evento, setEvento] = useState({});

  const { user } = useUser();

  const fetchCalendari = () => {
    axios
      .get(`/api/calendar/${user.sub}`)
      .then((response) => {
        setCalendari(response.data.calendari);
      })
      .catch((error) => {});
  };

  const openCalendario = (calendario) => {
    setCalendario({ ...calendario });
    setRight("modificaCalendario");
  };

  const openEvento = (evento) => {
    setEvento({ ...evento });
    setRight("modificaEvento");
  };

  const getRight = () => {
    if (right == "creaCalendario") {
      return (
        <CreateCalendar
          close={() => {
            setRight("empty");
          }}
          refreshCalendari={() => {
            fetchCalendari();
          }}
        />
      );
    }
    if (right == "creaEvento") {
      return (
        <CreateEvent
          calendari={calendari}
          close={() => {
            setRight("empty");
          }}
          refreshEvento={(id) => fetchEvento(id)}
        />
      );
    }
    if (right == "modificaCalendario") {
      return (
        <ModificaCalendario
          calendario={calendario}
          close={() => {
            setRight("empty");
          }}
          refreshCalendari={() => {
            fetchCalendari();
          }}
        />
      );
    }
    if (right == "modificaEvento") {
      return (
        <ModificaEvento
          evento={evento}
          calendari={calendari}
          close={() => {
            setRight("empty");
          }}
          refreshEvento={(id) => {
            fetchEvento(id);
          }}
        />
      );
    }
    return null;
  };

  const fetchEvento = (id) => {
    axios
      .get(`/api/event/${id}`, {
        params: {
          userId: user.sub,
        },
      })
      .then((response) => {
        setEventi((eventi) => {
          let temp = { ...eventi };
          temp[id] = response.data.eventi;
          return { ...temp };
        });
      })
      .catch((error) => {
        setEventi((eventi) => {
          let temp = { ...eventi };
          temp[id] = [];
          return { ...temp };
        });
      });
  };

  const fetchEventi = () => {
    calendari.map((element) => {
      fetchEvento(element._id);
    });
  };

  useEffect(() => {
    fetchCalendari();
  }, [user]);

  useEffect(() => {
    fetchEventi();
  }, [calendari]);

  return (
    <div>
      <Head>
        <title>Eventi</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className={styles.home}>
        <Menu selected="Eventi" />
        <div className={styles["left-tab"]}>
          <div className={styles.flex}>
            <ResizeButton
              text="Crea Evento"
              icon="more_time"
              callback={() => {
                setRight("creaEvento");
              }}
            />
            <ResizeButton text="Crea Evento Ripetuto" icon="update" />
          </div>
          <ResizeButton
            text="Crea Calendario"
            icon="event_note"
            callback={() => {
              setRight("creaCalendario");
            }}
          />
          <div className={styles.line} />
          {calendari.map((element) => {
            return (
              <VoceCalendario
                calendario={element}
                eventi={eventi[element._id]}
                key={"event" + element._id}
                openCalendario={(calendario) => {
                  openCalendario(calendario);
                }}
                openEvento={(evento) => {
                  openEvento(evento);
                }}
              />
            );
          })}
        </div>
        <div className={styles["right-tab"]}>
          <div className={styles.wrapper}> {getRight()}</div>
        </div>
      </div>
    </div>
  );
});
