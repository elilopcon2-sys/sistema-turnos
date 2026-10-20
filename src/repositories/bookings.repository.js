import BookingsDao from "../dao/bookings.dao.js";

class BookingsRepository {
  constructor(dao = new BookingsDao()) {
    this.dao = dao;
  }
    getAll() {
    return this.dao.getAll();
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

  delete(id) {
    return this.dao.delete(id);
  }
}

export default BookingsRepository;