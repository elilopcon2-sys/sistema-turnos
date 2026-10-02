import ServicesRepository from "../repositories/services.repository.js";

class ServicesService {
  constructor(repository = new ServicesRepository()) {
    this.repository = repository;
  }
  
  async getServices(filters = {}) {
  let services = await this.repository.getAll();

  const { category, available } = filters;

  if (category) {
    services = services.filter(
      service => service.category === category
    );
  }

  if (available !== undefined) {
    const availableBoolean = available === "true";

    services = services.filter(
      service => service.available === availableBoolean
    );
  }
  return services;  
}
    async getServiceById(id) {
    const service = await this.repository.getById(id);

    if (!service) {
        throw new Error("Servicio no encontrado");
    }

    return service;
}
  async createService(data) {
  if (
    !data ||
    typeof data.name !== "string" ||
    data.name.trim() === "" ||
    typeof data.description !== "string" ||
    data.description.trim() === "" ||
    !Number.isFinite(data.duration) ||
    data.duration <= 0 ||
    !Number.isFinite(data.price) ||
    data.price < 0 ||
    typeof data.category !== "string" ||
    data.category.trim() === "" ||
    typeof data.available !== "boolean"
  ) {
    throw new Error("Faltan campos obligatorios o tienen valores inválidos");
  }

  return await this.repository.create(data);
}
  async updateService(id, data) {
  const currentService = await this.repository.getById(id);

  if (!currentService) {
    throw new Error("Servicio no encontrado");
  }

  const updatedService = {
    ...currentService,
    ...data,
    id: currentService.id
  };

  if (
    typeof updatedService.name !== "string" ||
    updatedService.name.trim() === "" ||
    typeof updatedService.description !== "string" ||
    updatedService.description.trim() === "" ||
    !Number.isFinite(updatedService.duration) ||
    updatedService.duration <= 0 ||
    !Number.isFinite(updatedService.price) ||
    updatedService.price < 0 ||
    typeof updatedService.category !== "string" ||
    updatedService.category.trim() === "" ||
    typeof updatedService.available !== "boolean"
  ) {
    throw new Error("Los datos del servicio son inválidos");
  }

  return await this.repository.update(id, data);
}

 async deleteService(id) {
  const service = await this.repository.getById(id);

  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  return await this.repository.delete(id);
}
}

export default ServicesService;