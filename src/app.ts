import express from "express";
import cors from "cors";
import api from "./routes";
import './db'

import * as middlewares from "./middlewares";

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
