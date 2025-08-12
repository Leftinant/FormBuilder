import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import formsRouter from "./routes/formRoutes";
import responsesRouter from "./routes/responses";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.use("/api/forms", formsRouter);
app.use("/api/responses", responsesRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/form-builder";

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server listening on", PORT));
  })
  .catch((err) => {
    console.error("DB Err", err);
  });
