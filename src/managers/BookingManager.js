import fs from "fs/promises";

class BookingManager {

  async readBookings() {
    try {
      const data = await fs.readFile(
        "./src/data/bookings.json",
        "utf-8"
      );

      return JSON.parse(data);

    } catch (error) {
      console.log("Error al leer las reservas:", error.message);
      return [];
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
  async addServiceToBooking(bookingId, serviceId) {
  const bookings = await this.readBookings();

  const booking = bookings.find(
    booking => booking.id === bookingId
  );

  if (!booking) {
    return null;
  }
 }

}

export default BookingManager;