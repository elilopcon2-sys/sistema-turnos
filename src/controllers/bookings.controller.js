import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

export const createBooking = async (req, res) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      message: "Faltan campos obligatorios"
    });
  }

  const newBooking = await bookingManager.createBooking(req.body);

  if (!newBooking) {
    return res.status(400).json({
      message: "Faltan campos obligatorios"
    });
  }

  return res.status(201).json(newBooking);
};

export const getBookingById = async (req, res) => {
  const id = Number(req.params.bid);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "El ID de la reserva debe ser un entero positivo"
    });
  }

  const booking = await bookingManager.getBookingById(id);

  if (!booking) {
    return res.status(404).json({
      message: "Reserva no encontrada"
    });
  }

  return res.status(200).json(booking);
};
export const addServiceToBooking = async (req, res) => {
  const bookingId = Number(req.params.bid);
  const serviceId = Number(req.params.sid);

  if (
    !Number.isSafeInteger(bookingId) ||
    bookingId <= 0 ||
    !Number.isSafeInteger(serviceId) ||
    serviceId <= 0
  ) {
    return res.status(400).json({
      message: "Los IDs deben ser enteros positivos"
    });
  }

  const booking = await bookingManager.getBookingById(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Reserva o servicio no encontrado"
    });
  }

  const service = await serviceManager.getServiceById(serviceId);

  if (!service) {
    return res.status(404).json({
      message: "Reserva o servicio no encontrado"
    });
  }

  const updatedBooking = await bookingManager.addServiceToBooking(
    bookingId,
    serviceId
  );

  if (!updatedBooking) {
    return res.status(404).json({
      message: "Reserva o servicio no encontrado"
    });
  }

  return res.status(200).json(updatedBooking);
};