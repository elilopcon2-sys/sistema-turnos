import ServicesRepository from "../repositories/services.repository.js";

class ServicesService {
  constructor(repository = new ServicesRepository()) {
    this.repository = repository;
  }
  
  async getServices(query = {}) {
    const {
      category,
      available,
      page = 1,
      limit = 10,
      sortBy = "id",
      order = "asc",
    } = query;

    // 1. Construir filtros para MongoDB
    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (available !== undefined) {
      filters.available = available === "true";
    }

    // 2. Paginación
    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * currentLimit;

    // 3. Ordenamiento
    const allowedSortFields = [
      "id",
      "name",
      "duration",
      "price",
      "category",
      "available",
    ];

    const selectedSortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "id";

    const sortOrder = order === "desc" ? -1 : 1;

    const sort = {
      [selectedSortField]: sortOrder,
    };

    // 4. Consultar MongoDB
    const [services, total] = await Promise.all([
      this.repository.getAll({
        filters,
        skip,
        limit: currentLimit,
        sort,
      }),

      this.repository.count(filters),
    ]);

    // 5. Metadatos de paginación
    const totalPages = Math.ceil(total / currentLimit);

    return {
      services,
      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    };
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