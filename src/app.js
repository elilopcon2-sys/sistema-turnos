import express from "express";
import "./config/env.config.js";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";

const app = express();

app.use(express.json());

app.use("/api/services", servicesRouter); 
app.use("/api/bookings", bookingsRouter);

export default app;