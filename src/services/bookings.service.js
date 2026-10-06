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

  async createBooking(data) {
    return await this.repository.create(data);
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

  const existingService = booking.services.find(
    item => item.service === serviceId
  );

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
}

export default BookingsService;