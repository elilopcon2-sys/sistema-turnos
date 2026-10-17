import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

class BookingsService {
  constructor(
    bookingsRepository = new BookingsRepository(),
    servicesRepository = new ServicesRepository()
  ) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }
  async getBookings() {
    return await this.bookingsRepository.getAll();
  }
 async createBooking(data) {
    return await this.bookingsRepository.create({
      ...data,
      services: [],
    });
  }
  async getBookingById(id) {
  const booking = await this.bookingsRepository.getById(id);

  if (!booking) {
    throw new Error("Reserva no encontrada");
  }

  return booking;
}
async addServiceToBooking(bookingId, serviceId) {
  const booking = await this.bookingsRepository.getById(bookingId);

  if (!booking) {
    throw new Error("Reserva no encontrada");
  }

  const service = await this.servicesRepository.getById(serviceId);

  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  const existingService = booking.services.find((item) => {
    const currentServiceId =
      typeof item.service === "object"
        ? item.service.id
        : item.service;

      return currentServiceId === serviceId;
    });

  if (existingService) {
    existingService.quantity += 1;
  } else {
    booking.services.push({
      service: serviceId,
      quantity: 1
    });
  }

  return await this.bookingsRepository.update(
    bookingId,
    booking
  );
}
async updateServiceQuantity(bookingId, serviceId, quantity) {
  const booking = await this.bookingsRepository.getById(bookingId);

  if (!booking) {
    throw new Error("Reserva no encontrada");
  }

  const bookingService = booking.services.find((item) => {
    const currentServiceId =
      typeof item.service === "object"
        ? item.service.id
        : item.service;

    return currentServiceId === serviceId;
  });

  if (!bookingService) {
    throw new Error("El servicio no está asociado a la reserva");
  }

  bookingService.quantity = quantity;

  return await this.bookingsRepository.update(bookingId, booking);
}
}

export default BookingsService;