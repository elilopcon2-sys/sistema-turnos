import express from "express";
import "./config/env.config.js";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.json());

app.use("/api/services", servicesRouter); 
app.use("/api/bookings", bookingsRouter);
app.use("/", viewsRouter);

export default app;