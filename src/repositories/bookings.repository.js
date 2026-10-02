import BookingsDao from "../dao/bookings.dao.js";

class BookingsRepository {
  constructor(dao = new BookingsDao()) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }
}

export default BookingsRepository;