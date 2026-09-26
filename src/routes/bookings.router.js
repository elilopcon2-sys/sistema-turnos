import { Router } from "express";
import {
   createBooking,
   getBookingById,
   addServiceToBooking } from "../controllers/bookings.controller.js";

const router = Router();
// Crear una reserva
router.post("/", createBooking);
// Consultar una reserva por su ID
router.get("/:bid", getBookingById);
// Agregar un servicio a una reserva
router.post("/:bid/services/:sid", addServiceToBooking);

export default router;