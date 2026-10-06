import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBookingSchema,
  addServiceToBookingSchema,
} from "../validations/booking.validation.js";
import {
   createBooking,
   getBookingById,
   addServiceToBooking } from "../controllers/bookings.controller.js";

const router = Router();
// Crear una reserva
router.post(
  "/",
  validate(createBookingSchema),
  createBooking
);
// Consultar una reserva por su ID
router.get("/:bid", getBookingById);
// Agregar un servicio a una reserva
router.post(
  "/:bid/services/:sid",
  validate(addServiceToBookingSchema),
  addServiceToBooking
);

export default router;