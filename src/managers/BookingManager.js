import fs from "fs/promises";
import ServiceManager from "./ServiceManager.js";

class BookingManager {

  async readBookings() {
    try {
      const data = await fs.readFile(
        "./src/data/bookings.json",
        "utf-8"
      );

      return JSON.parse(data);

    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

  async writeBookings(bookings) {
  await fs.writeFile(
    "./src/data/bookings.json",
    JSON.stringify(bookings, null, 2)
  );
  }
  
  async createBooking(bookingData) {
  if (
    !bookingData.clientName ||
    !bookingData.clientEmail ||
    !bookingData.date ||
    !bookingData.time ||
    !bookingData.status
  ) {
    return null;
  }

  const bookings = await this.readBookings();

  const newId = bookings.length
    ? Math.max(...bookings.map(booking => booking.id)) + 1
    : 1;

  const newBooking = {
    id: newId,
    clientName: bookingData.clientName,
    clientEmail: bookingData.clientEmail,
    date: bookingData.date,
    time: bookingData.time,
    status: bookingData.status,
    services: []
  };

  bookings.push(newBooking);

  await this.writeBookings(bookings);

  return newBooking;
}
 async getBookingById(id) {
  const bookings = await this.readBookings();

  return bookings.find(booking => booking.id === id) || null;
 }
 
 async addServiceToBooking(bookingId, serviceId) {
  const bookings = await this.readBookings();

  const booking = bookings.find(
    booking => booking.id === bookingId
  );

  if (!booking) {
    return null;
  }

  const serviceManager = new ServiceManager();
  const service = await serviceManager.getServiceById(serviceId);

  if (!service) {
    return null;
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

  await this.writeBookings(bookings);

  return booking;
}

}

export default BookingManager;