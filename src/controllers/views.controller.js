import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export const renderServices = async (req, res, next) => {
  try {
    const result = await servicesService.getServices();

    res.render("services", { services: result.services });
  } catch (error) {
    next(error);
  }
};

export const renderAvailability = async (req, res, next) => {
  try {
    const result = await servicesService.getServices({
      available: "true"
    });

    res.render("availability", { services: result.services });
  } catch (error) {
    next(error);
  }
};
export const renderServiceDetail = async (req, res, next) => {
  try {
    const serviceId = Number(req.params.sid);
    const service = await servicesService.getServiceById(serviceId);

    res.render("service-detail", { service });
  } catch (error) {
    next(error);
  }
};
export const renderBookingDetail = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.bid);

    const booking = await bookingsService.getBookingById(bookingId);

    res.render("booking-detail", { booking });
  } catch (error) {
    next(error);
  }
};