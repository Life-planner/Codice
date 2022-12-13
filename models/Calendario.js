import mongoose from "mongoose";

const colorValidator = (v) => /^#([0-9a-f]{3}){1,2}$/i.test(v);

const SchemaCalendario = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Please provide a name for this calendar."],
    },
    fusoOrario: {
      type: {
        GMTOffset: {
          type: Number,
          default: 0,
          min: -12,
          max: 12,
        },
        localita: {
          type: String,
          default: "London",
        },
      },
      default: {
        GMTOffset: 0,
        localita: "London",
      },
    },
    colore: {
      type: String,
      default: "#7C36B9",
    },
    partecipanti: {
      type: [String],
      required: [true, "Please provide a user for this calendar."],
    },
    principale: {
      type: Boolean,
      default: false,
    },
    impostazioniPredefiniteEventi: {
      type: {
        titolo: {
          type: String,
          default: "",
        },
        descrizione: {
          type: String,
          default: "",
        },
        durata: {
          type: Number,
          default: 30,
          min: 1,
        },
        tempAnticNotifica: {
          type: Number,
          default: 30,
          min: 1,
        },
        luogo: {
          type: {
            latitudine: { type: String, default: "" },
            longitudine: { type: String, default: "" },
          },
        },
        priorita: { type: Number, default: 6, min: 1, max: 10 },
        difficolta: { type: Number, default: 6, min: 1, max: 10 },
      },
      default: {
        titolo: "",
        descrizione: "",
        durata: 30,
        tempAnticNotifica: 30,
        luogo: {
          latitudine: "",
          longitudine: "",
        },
        priorita: 6,
        difficolta: 6,
      },
    },
  },
  { collection: "Calendario" },
);

module.exports =
  mongoose.models.Calendario || mongoose.model("Calendario", SchemaCalendario);
