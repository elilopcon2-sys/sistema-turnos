import ServicesService from "../services/services.service.js";
const servicesService = new ServicesService();

export const getServices = async (req, res) => {
  const services = await servicesService.getServices(req.query);

  return res.status(200).json(services);
};

export const getServiceById = async (req, res) => {
  const id = Number(req.params.sid);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "El ID del servicio debe ser un entero positivo"
    });
  }

  try {
    const service = await servicesService.getServiceById(id);

    return res.status(200).json(service);

  } catch (error) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({
        message: error.message
      });
    }

    throw error;
  }
};
export const createService = async (req, res) => {
  try {
    const newService = await servicesService.createService(req.body);

    const io = req.app.get("io");

    if (io) {
      io.emit("service:created", newService);
    }

    return res.status(201).json(newService);

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const updateService = async (req, res, next) => {
  const id = Number(req.params.sid);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "El ID del servicio debe ser un entero positivo"
    });
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    return res.status(400).json({
      message: "Debes enviar los datos que deseas actualizar"
    });
  }

  try {
    const updatedService = await servicesService.updateService(
      id,
      req.body
    );

    return res.status(200).json(updatedService);

  } catch (error) {
    if (
      error.message === "Servicio no encontrado"
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    if (
      error.message === "Los datos del servicio son inválidos"
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    return next(error);
  }
};
export const deleteService = async (req, res) => {
  const id = Number(req.params.sid);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "El ID del servicio debe ser un entero positivo"
    });
  }

  try {
    const deletedService = await servicesService.deleteService(id);

    return res.status(200).json(deletedService);

  } catch (error) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({
        message: error.message
      });
    }

    throw error;
  }
};