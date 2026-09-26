import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();

export const getServices = async (req, res) => {
  const { category, available } = req.query;

  let services = await serviceManager.getServices();

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

  return res.status(200).json(services);
};

export const getServiceById = async (req, res) => {
  const id = Number(req.params.sid);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "El ID del servicio debe ser un entero positivo"
    });
  }

  const service = await serviceManager.getServiceById(id);

  if (!service) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  return res.status(200).json(service);
};
export const createService = async (req, res) => {
  const newService = await serviceManager.addService(req.body);

  if (!newService) {
    return res.status(400).json({
      message: "Faltan campos obligatorios o tienen valores inválidos"
    });
  }

  return res.status(201).json(newService);
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
    const updatedService = await serviceManager.updateService(
      id,
      req.body
    );

    if (!updatedService) {
      return res.status(404).json({
        message: "Servicio no encontrado"
      });
    }

    return res.status(200).json(updatedService);
  } catch (error) {
    if (error.message === "Los datos del servicio son inválidos") {
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

  const deletedService = await serviceManager.deleteService(id);

  if (!deletedService) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  return res.status(200).json(deletedService);
};