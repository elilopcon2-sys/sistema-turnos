import { ServiceModel } from "./models/service.model.js";

const toDTO = (service) => {
  if (!service) {
    return null;
  }

  const {
    _id,
    __v,
    createdAt,
    updatedAt,
    ...serviceData
  } = service;

  return serviceData;
};

class ServicesDao {
async getAll({
  filters = {},
  skip = 0,
  limit = 10,
  sort = { id: 1 },
} = {}) {
  const services = await ServiceModel.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return services.map(toDTO);
}
  async count(filters = {}) {
  return await ServiceModel.countDocuments(filters);
}
  async getById(id) {
    const service = await ServiceModel.findOne({ id }).lean();

    return toDTO(service);
  }

  async create(data) {
    const lastService = await ServiceModel.findOne()
      .sort({ id: -1 })
      .lean();

    const newId = lastService ? lastService.id + 1 : 1;

    const newService = await ServiceModel.create({
      ...data,
      id: newId,
    });

    return toDTO(newService.toObject());
  }

  async update(id, data) {
    const { id: ignoredId, _id: ignoredMongoId, ...updates } = data;

    const updatedService = await ServiceModel.findOneAndUpdate(
      { id },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    return toDTO(updatedService);
  }

  async delete(id) {
    const deletedService = await ServiceModel.findOneAndDelete({ id }).lean();

    return toDTO(deletedService);
  }
}

export default ServicesDao;