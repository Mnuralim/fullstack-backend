import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import ProductRoute from "./routes/ProductRoute.js";
import morgan from "morgan";

dotenv.config();
const app = express();

db();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", ProductRoute);

app.listen(process.env.PORT, () => console.log("server is running"));
