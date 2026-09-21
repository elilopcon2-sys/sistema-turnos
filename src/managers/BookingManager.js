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
  
}

export default BookingManager;