import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBookingSchema,
  addServiceToBookingSchema,
  updateServiceQuantitySchema,
} from "../validations/booking.validation.js";
import {
  createBooking,
  getBookings,
  getBookingById,
  addServiceToBooking,
  updateServiceQuantity,
} from "../controllers/bookings.controller.js";

const router = Router();

// Obtener reservas
router.get("/", getBookings);
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
// Actualiza la cantidad de un servicio dentro de una reserva 
router.put(
  "/:bid/services/:sid",
  validate(updateServiceQuantitySchema),
  updateServiceQuantity
);
export default router;