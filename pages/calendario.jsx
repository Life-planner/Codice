import Head from "next/head";
import Router from "next/router";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import axios from "axios";

import styles from "../styles/calendario.module.css";
import Menu from "../components/Menu";
import CalendarMenu from "../components/calendarMenu";
import DayBox from "../components/dayBox";
import Hour from "../components/Hour";
import Activity from "../components/Activity";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Fab from "../components/Fab";
import CreateCalendar from "../components/CreateCalendar";
import CreateEvent from "../components/CreaEvento";
import VisualizzaEvento from "../components/VisualizzaEvento";

export default withPageAuthRequired(function Calendario() {
  const [firstDay, setFirstDay] = useState(getMonday(new Date()));
  const [sidebar, setSidebar] = useState(false);
  const [createCalendarShow, setCreateCalendarShow] = useState(false);
  const [createEventShow, setCreateEventShow] = useState(false);
  const [visualizzaEvent, setVisualizzaEvent] = useState(false);
  const [calendari, setCalendari] = useState([]);
  const [eventi, setEventi] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [weekEvent, setweekEvent] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });

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
    fetchEventi();
  }, [calendari]);

  const getCalendarName = (id) => {
    const x = calendari.find(function (x) {
      if (x._id === id) return true;
    });
    return x.nome;
  };

  const getCalendarColor = (id) => {
    const x = calendari.find(function (x) {
      if (x._id === id) return true;
    });
    return x.colore;
  };

  const { user } = useUser();

  const data = useMemo(() => {
    let data = [];
    for (let i = 0; i < 23; i++) {
      data.push(
        <>
          <div className={styles.cell}>
            <Hour index={i} />
          </div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={`${styles.cell} ${styles.last}`}></div>
        </>
      );
    }
    data.push(
      <>
        <div className={`${styles.cell} ${styles.last2}`}>
          <Hour index={23} />
        </div>
        <div className={`${styles.cell} ${styles.last2}`}></div>
        <div className={`${styles.cell} ${styles.last2}`}></div>
        <div className={`${styles.cell} ${styles.last2}`}></div>
        <div className={`${styles.cell} ${styles.last2}`}></div>
        <div className={`${styles.cell} ${styles.last2}`}></div>
        <div className={`${styles.cell} ${styles.last2}`}></div>
        <div className={`${styles.cell} ${styles.last} ${styles.last2}`}></div>
      </>
    );
    return data.map((item, key) => React.cloneElement(item, { key }));
  });

  const checkCalendari = (index) => {
    let temp = [...calendari];
    temp[index] = { ...temp[index], deselect: !temp[index].deselect };
    setCalendari(temp);
  };

  const setAccount = async () => {
    try {
      await axios.get(`/api/user/email/${user.email}`);
    } catch (error) {
      if (error.response.data.error === "There is no user with that email") {
        axios
          .post("/api/user", null, {
            params: {
              userId: user.sub,
              email: user.email,
              username: user.email,
            },
          })
          .then(function () {
            axios
              .post("/api/calendar", null, {
                params: {
                  userId: user.sub,
                  nome: "Principale",
                  colore: "#1e1e1e",
                  principale: true,
                  impostazioniPredefiniteEventi: JSON.stringify({
                    titolo: "",
                    descrizione: "eDescrizione",
                    durata: 30,
                    tempAnticNotifica: 30,
                    luogo: {
                      latitudine: "0.000000",
                      longitudine: "0.000000",
                    },
                    priorita: 6,
                    difficolta: 6,
                  }),
                },
              })
              .then(function () {
                Router.push("/soprannome");
              })
              .catch(function (error) {
                console.error(error);
              });
            Router.push("/soprannome");
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        console.error(error.response.data);
      }
    }
  };

  const fetchCalendari = () => {
    axios
      .get(`/api/calendar/${user.sub}`)
      .then((response) => {
        setCalendari(response.data.calendari);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadEvent = () => {
    calendari.map((elemento) => {
      if (elemento.deselect != true) {
        if (!eventi[elemento._id]) return;
        eventi[elemento._id].map((evento) => {
          let data = new Date(evento.eventoSingolo.data);
          if (data >= firstDay && data < getDateOffset(+7)) {
            setweekEvent((prev) => {
              let temp = { ...prev };
              temp[data.getUTCDate() - firstDay.getUTCDate() - 1].push(evento);
              return { ...temp };
            });
          }
        });
      }
    });
  };

  const reset = () => {
    setweekEvent({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
  };

  useEffect(() => {
    setAccount();
    fetchCalendari();
  }, [user]);

  useEffect(() => {
    reset();
    loadEvent();
  }, [eventi, firstDay]);

  const closeCalendar = () => {
    setCreateCalendarShow(false);
  };

  const openCalendar = () => {
    setCreateCalendarShow(true);
  };

  const closeShowEvent = () => {
    setVisualizzaEvent(false);
  };

  const openShowEvent = (event) => {
    setSelectedEvent({ ...event });
    setVisualizzaEvent(true);
  };

  const closeEvent = () => {
    setCreateEventShow(false);
  };

  const openEvent = () => {
    setCreateEventShow(true);
  };

  const goToday = () => {
    setFirstDay(getMonday(new Date()));
  };

  const openSidebar = () => {
    setSidebar(true);
  };

  const closeSidebar = () => {
    setSidebar(false);
  };

  const getDateOffset = (offset) => {
    let d = new Date(firstDay);
    d.setDate(d.getDate() + offset);
    return new Date(d);
  };

  const prevWeek = () => {
    setFirstDay(getDateOffset(-7));
  };

  const nextWeek = () => {
    setFirstDay(getDateOffset(+7));
  };

  function getMonday(d) {
    d = new Date(d.toDateString());
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  const isToday = (x, y) => x.toDateString() === y.toDateString();

  const getStart = (d) => {
    d = new Date(d);
    let time = d.getUTCMinutes();
    time += d.getUTCHours() * 60;
    return time;
  };

  return (
    <div>
      <Head>
        <title>Calendario</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className={styles.home}>
        <Menu selected="Calendario" />

        <Sidebar
          show={sidebar}
          closeSidebar={() => closeSidebar()}
          calendari={calendari}
          checkCalendari={checkCalendari}
        />
        {sidebar ? (
          <div className={styles.backdrop} onClick={() => closeSidebar()} />
        ) : null}

        <div className={styles.content}>
          <CalendarMenu
            firstDay={firstDay}
            goToday={() => goToday()}
            prevWeek={() => prevWeek()}
            nextWeek={() => nextWeek()}
            openSidebar={() => openSidebar()}
          />
          <div className={styles.calendario}>
            <div className={styles.highlight}>
              <div className={styles["highlight-grid"]}>
                <div></div>
                <div
                  className={
                    isToday(firstDay, new Date()) ? styles.selected : null
                  }
                ></div>
                <div
                  className={
                    isToday(getDateOffset(1), new Date())
                      ? styles.selected
                      : null
                  }
                ></div>
                <div
                  className={
                    isToday(getDateOffset(2), new Date())
                      ? styles.selected
                      : null
                  }
                ></div>
                <div
                  className={
                    isToday(getDateOffset(3), new Date())
                      ? styles.selected
                      : null
                  }
                ></div>
                <div
                  className={
                    isToday(getDateOffset(4), new Date())
                      ? styles.selected
                      : null
                  }
                ></div>
                <div
                  className={
                    isToday(getDateOffset(5), new Date())
                      ? styles.selected
                      : null
                  }
                ></div>
                <div
                  className={
                    isToday(getDateOffset(6), new Date())
                      ? styles.selected
                      : null
                  }
                ></div>
              </div>
            </div>
            <div className={styles.wrapper}>
              <div className={styles["grid-absolute"]}>
                <div className={styles.day0}>
                  {weekEvent[0].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
                <div className={styles.day1}>
                  {weekEvent[1].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
                <div className={styles.day2}>
                  {weekEvent[2].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
                <div className={styles.day3}>
                  {weekEvent[3].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
                <div className={styles.day4}>
                  {weekEvent[4].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
                <div className={styles.day5}>
                  {weekEvent[5].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
                <div className={styles.day6}>
                  {weekEvent[6].map((element) => {
                    return (
                      <Activity
                        event={element}
                        start={getStart(element.eventoSingolo.data)}
                        duration={element.durata}
                        calendar={getCalendarName(element.IDCalendario)}
                        title={element.titolo}
                        color={getCalendarColor(element.IDCalendario)}
                        callback={(event) => {
                          openShowEvent(event);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={styles.grid}>
                <div className={styles.header}></div>
                <div className={styles.header}>
                  <DayBox
                    index="0"
                    dayNumber={firstDay.getDate()}
                    selected={isToday(firstDay, new Date())}
                  />
                </div>
                <div className={styles.header}>
                  <DayBox
                    index="1"
                    dayNumber={getDateOffset(1).getDate()}
                    selected={isToday(getDateOffset(1), new Date())}
                  />
                </div>
                <div className={styles.header}>
                  <DayBox
                    index="2"
                    dayNumber={getDateOffset(2).getDate()}
                    selected={isToday(getDateOffset(2), new Date())}
                  />
                </div>
                <div className={styles.header}>
                  <DayBox
                    index="3"
                    dayNumber={getDateOffset(3).getDate()}
                    selected={isToday(getDateOffset(3), new Date())}
                  />
                </div>
                <div className={styles.header}>
                  <DayBox
                    index="4"
                    dayNumber={getDateOffset(4).getDate()}
                    selected={isToday(getDateOffset(4), new Date())}
                  />
                </div>
                <div className={styles.header}>
                  <DayBox
                    index="5"
                    dayNumber={getDateOffset(5).getDate()}
                    selected={isToday(getDateOffset(5), new Date())}
                  />
                </div>
                <div className={`${styles.header} ${styles.last}`}>
                  <DayBox
                    index="6"
                    dayNumber={getDateOffset(6).getDate()}
                    selected={isToday(getDateOffset(6), new Date())}
                  />
                </div>
                {data}
              </div>
            </div>
          </div>
        </div>
        {createCalendarShow ? (
          <div
            className={styles.backdrop}
            style={{ backgroundColor: "var(--black-50)" }}
            onClick={() => {
              closeCalendar();
            }}
          >
            <CreateCalendar
              close={() => closeCalendar()}
              refreshCalendari={() => fetchCalendari()}
            />
          </div>
        ) : null}
        {createEventShow ? (
          <div
            className={styles.backdrop}
            style={{ backgroundColor: "var(--black-50)" }}
            onClick={() => {
              closeEvent();
            }}
          >
            <CreateEvent
              close={() => closeEvent()}
              calendari={calendari}
              refreshEvento={(id) => fetchEvento(id)}
            />
          </div>
        ) : null}
        {visualizzaEvent ? (
          <div
            className={styles.backdrop}
            style={{ backgroundColor: "var(--black-50)" }}
            onClick={() => {
              closeShowEvent();
            }}
          >
            <VisualizzaEvento
              evento={selectedEvent}
              close={() => closeShowEvent()}
              calendari={calendari}
            />
          </div>
        ) : null}
        <Fab
          openCalendar={() => {
            openCalendar();
          }}
          openEvent={() => {
            openEvent();
          }}
        />
      </div>
    </div>
  );
});
