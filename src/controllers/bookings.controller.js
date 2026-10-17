import BookingsService from "../services/bookings.service.js";
const bookingsService = new BookingsService();

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await bookingsService.getBookings();

    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingsService.createBooking(req.body);

    return res.status(201).json(newBooking);

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  const id = Number(req.params.bid);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "El ID de la reserva debe ser un entero positivo"
    });
  }

  try {
    const booking = await bookingsService.getBookingById(id);

    return res.status(200).json(booking);

  } catch (error) {
    if (error.message === "Reserva no encontrada") {
      return res.status(404).json({
        message: error.message
      });
    }

    throw error;
  }
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

  try {
    const updatedBooking = await bookingsService.addServiceToBooking(
      bookingId,
      serviceId
    );

    return res.status(200).json(updatedBooking);

  } catch (error) {
    if (
      error.message === "Reserva no encontrada" ||
      error.message === "Servicio no encontrado"
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    throw error;
  }
};

export const updateServiceQuantity = async (req, res, next) => {
  const bookingId = Number(req.params.bid);
  const serviceId = Number(req.params.sid);

  try {
    const updatedBooking = await bookingsService.updateServiceQuantity(
      bookingId,
      serviceId,
      req.body.quantity
    );

    return res.status(200).json(updatedBooking);
  } catch (error) {
    if (
      error.message === "Reserva no encontrada" ||
      error.message === "El servicio no está asociado a la reserva"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return next(error);
  }
};