import mongoose from "mongoose";

const SchemaEvento = new mongoose.Schema(
  {
    IDCalendario: {
      type: String,
      required: [true, "Please provide a calendarID for this event."],
    },
    titolo: {
      type: String,
      required: [true, "Please provide a name for this calendar."],
    },
    descrizione: {
      type: String,
      default: "",
    },
    luogo: {
      type: {
        latitudine: {
          type: String,
          default: "",
        },
        longitudine: {
          type: String,
          default: "",
        },
      },
      default: {
        latitudine: "",
        longitudine: "",
      },
    },
    priorita: {
      type: Number,
      default: 6,
      min: 1,
      max: 10,
    },
    difficolta: {
      type: Number,
      default: 6,
      min: 1,
      max: 10,
    },
    partecipanti: {
      type: [String],
      required: [true, "Please provide a user for this evento."],
    },
    notifiche: {
      type: {
        titolo: {
          type: String,
          default: "Notifica evento",
        },
        data: {
          type: [Date],
          default: [],
        },
      },
      default: {
        titolo: "Notifica evento",
        data: [],
      },
    },
    durata: {
      type: Number,
      default: 30,
    },
    isEventoSingolo: {
      type: Boolean,
      default: true,
    },
    eventoSingolo: {
      type: {
        data: {
          type: Date,
          default: Date.now,
        },
        isScadenza: {
          type: Boolean,
          default: false,
        },
      },
      default: {
        data: Date.now,
        isScadenza: false,
      },
    },
    eventoRipetuto: {
      type: {
        numeroRipetizioni: {
          type: Number,
          min: 1,
          default: 1,
        },
        impostazioniAvanzate: {
          type: {
            giorniSettimana: {
              type: [String],
            },
            data: {
              type: [Date],
            },
          },
          default: {
            giorniSettimana: ["Lunedi"],
            data: Date.now,
          },
        },
      },
      default: {
        numeroRipetizioni: 1,
        impostazioniAvanzate: {
          giorniSettimana: ["Lunedi"],
          data: Date.now,
        },
      },
    },
  },
  { collection: "Evento" },
);

module.exports =
  mongoose.models.Evento || mongoose.model("Evento", SchemaEvento);
