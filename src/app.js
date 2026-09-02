import express from "express";
import "./config/env.config.js";

const app = express();

app.use(express.json());

export default app;