import { BookingModel } from "./models/booking.model.js";
import { ServiceModel } from "./models/service.model.js";

const toDTO = (booking) => {
  if (!booking) {
    return null;
  }

  const {
    _id,
    __v,
    createdAt,
    updatedAt,
    services = [],
    ...bookingData
  } = booking;

  return {
    ...bookingData,
    services: services.map((item) => ({
    service: item.service,
    quantity: item.quantity,
  })),
  };
};

const mapServiceReferences = async (services = []) => {
  const serviceIds = services.map((item) => item.service);

  const serviceDocuments = await ServiceModel.find({
    id: { $in: serviceIds },
  })
    .select("_id id")
    .lean();

  const servicesById = new Map(
    serviceDocuments.map((service) => [service.id, service._id])
  );

  return services.map((item) => {
    const serviceObjectId = servicesById.get(item.service);

    if (!serviceObjectId) {
      throw new Error("Servicio no encontrado");
    }

    return {
      service: serviceObjectId,
      quantity: item.quantity,
    };
  });
};

class BookingsDao {
  async getById(id) {
    const booking = await BookingModel.findOne({ id })
      .populate({
      path: "services.service",
      select: "id name description duration price category available",
    })
      .lean();

    return toDTO(booking);
  }

  async create(data) {
    const lastBooking = await BookingModel.findOne()
      .sort({ id: -1 })
      .lean();

    const newId = lastBooking ? lastBooking.id + 1 : 1;

    const newBooking = await BookingModel.create({
      ...data,
      id: newId,
    });

    return toDTO(newBooking.toObject());
  }

  async update(id, data) {
    const { id: ignoredId, _id: ignoredMongoId, ...updates } = data;

    if (updates.services) {
      updates.services = await mapServiceReferences(updates.services);
    }

    const updatedBooking = await BookingModel.findOneAndUpdate(
      { id },
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "services.service",
        select: "id name description duration price category available",
      })
      .lean();

    return toDTO(updatedBooking);
  }
}

export default BookingsDao;