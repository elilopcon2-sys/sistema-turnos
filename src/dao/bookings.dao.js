import fs from "fs/promises";

const PATH = "./src/data/bookings.json";

class BookingsDao {

async getAll() {
    try {
      const data = await fs.readFile(PATH, "utf-8");

      return JSON.parse(data);

    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

async getById(id) {
  const bookings = await this.getAll();

  return bookings.find(
    booking => booking.id === id
  ) || null;
}
async create(data) {
  const bookings = await this.getAll();

  const newId = bookings.length
    ? Math.max(...bookings.map(booking => booking.id)) + 1
    : 1;

  const newBooking = {
    id: newId,
    ...data
  };

  bookings.push(newBooking);

  await fs.writeFile(
    PATH,
    JSON.stringify(bookings, null, 2)
  );

  return newBooking;
}
async update(id, data) {
  const bookings = await this.getAll();

  const index = bookings.findIndex(
    booking => booking.id === id
  );

  if (index === -1) {
    return null;
  }

  const updatedBooking = {
    ...bookings[index],
    ...data,
    id: bookings[index].id
  };

  bookings[index] = updatedBooking;

  await fs.writeFile(
    PATH,
    JSON.stringify(bookings, null, 2)
  );

  return updatedBooking;
}
}

export default BookingsDao;