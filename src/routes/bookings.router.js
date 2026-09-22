import { Router } from "express";
import BookingManager from "../managers/BookingManager.js";

const router = Router();
const bookingManager = new BookingManager();

// Crear una reserva
router.post("/", async (req, res) => {
  const newBooking = await bookingManager.createBooking(req.body);

  if (!newBooking) {
    return res.status(400).json({
      message: "Faltan campos obligatorios"
    });
  }

  res.status(201).json(newBooking);
});

// Consultar una reserva por su ID
router.get("/:bid", async (req, res) => {
  const id = Number(req.params.bid);

  const booking = await bookingManager.getBookingById(id);

  if (!booking) {
    return res.status(404).json({
      message: "Reserva no encontrada"
    });
  }

  res.status(200).json(booking);
});

// Agregar un servicio a una reserva
router.post("/:bid/services/:sid", async (req, res) => {
  const bookingId = Number(req.params.bid);
  const serviceId = Number(req.params.sid);

  const updatedBooking = await bookingManager.addServiceToBooking(
    bookingId,
    serviceId
  );

  if (!updatedBooking) {
    return res.status(404).json({
      message: "Reserva o servicio no encontrado"
    });
  }

  res.status(200).json(updatedBooking);
});

export default router;