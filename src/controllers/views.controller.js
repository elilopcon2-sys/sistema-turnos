import ServicesService from "../services/services.service.js";

const servicesService = new ServicesService();

export const renderServices = async (req, res, next) => {
  try {
    const services = await servicesService.getServices();

    res.render("services", { services });
  } catch (error) {
    next(error);
  }
};

export const renderAvailability = async (req, res, next) => {
  try {
    const services = await servicesService.getServices({
      available: "true"
    });

    res.render("availability", { services });
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