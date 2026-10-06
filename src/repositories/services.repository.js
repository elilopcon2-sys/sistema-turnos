import ServicesDao from "../dao/services.dao.js";

class ServicesRepository {
  constructor(dao = new ServicesDao()) {
    this.dao = dao;
  }

  getAll(options) {
  return this.dao.getAll(options);
}
  count(filters) {
    return this.dao.count(filters);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  create(data) {
    return this.dao.create(data);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }

  delete(id) {
    return this.dao.delete(id);
  }
}

export default ServicesRepository;