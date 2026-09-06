import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";


const router = Router();
const serviceManager = new ServiceManager();

router.get("/", (req, res) => {
  const { category, available } = req.query;

  let services = serviceManager.getServices();

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

  res.status(200).json(services);
});
router.get("/:sid", (req, res) => {
  const id = Number(req.params.sid);

  const service = serviceManager.getServiceById(id);

  if (!service) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  res.status(200).json(service);
});

router.post("/", (req, res) => {
  const newService = serviceManager.addService(req.body);

  if (!newService) {
    return res.status(400).json({
      message: "Faltan campos obligatorios"
    });
  }

  res.status(201).json(newService);
});

router.put("/:sid", (req, res) => {
  const id = Number(req.params.sid);

  const updatedService = serviceManager.updateService(id, req.body);

  if (!updatedService) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  res.status(200).json(updatedService);
});

router.delete("/:sid", (req, res) => {
  const id = Number(req.params.sid);

  const deletedService = serviceManager.deleteService(id);

  if (!deletedService) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  res.status(200).json(deletedService);
});

export default router;