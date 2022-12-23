import mongoose from "mongoose";

const SchemaUtenteAutenticato = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide a userId for this user."],
    },
    email: {
      type: String,
      required: [true, "Please provide a userId for this user."],
      maxlength: [320, "Email cannot be more than 320 characters"],
    },
    username: {
      type: String,
      required: [true, "Please provide a userId for this user."],
    },
  },
  { collection: "UtenteAutenticato" },
);

module.exports =
  mongoose.models.UtenteAutenticato ||
  mongoose.model(
    "UtenteAutenticato",
    SchemaUtenteAutenticato
  );
