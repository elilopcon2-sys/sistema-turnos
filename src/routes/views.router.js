import { Router } from "express";
import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.service.js";

const router = Router();
const servicesService = new ServicesService();
const bookingsService = new BookingsService();

router.get("/services", async (req, res, next) => {
  try {
    const services = await servicesService.getServices();

    res.render("services", { services });
  } catch (error) {
    next(error);
  }
});

router.get("/services/:sid", async (req, res, next) => {
  try {
    const serviceId = Number(req.params.sid);
    const service = await servicesService.getServiceById(serviceId);

    res.render("service-detail", { service });
  } catch (error) {
    next(error);
  }
});

router.get("/bookings/:bid", async (req, res, next) => {
  try {
    const bookingId = Number(req.params.bid);
    const booking = await bookingsService.getBookingById(bookingId);

    res.render("booking-detail", { booking });
  } catch (error) {
    next(error);
  }
});

export default router;