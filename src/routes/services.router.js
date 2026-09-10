import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";


const router = Router();
const serviceManager = new ServiceManager();

router.get("/", async (req, res) => {
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

  res.status(200).json(services);
});
router.get("/:sid", async  (req, res) => {
  const id = Number(req.params.sid);

  const service = await serviceManager.getServiceById(id);

  if (!service) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  res.status(200).json(service);
});

router.post("/", async (req, res) => {
  const newService = await serviceManager.addService(req.body);

  if (!newService) {
    return res.status(400).json({
      message: "Faltan campos obligatorios"
    });
  }

  res.status(201).json(newService);
});

router.put("/:sid", async  (req, res) => {
  const id = Number(req.params.sid);

  const updatedService = await serviceManager.updateService(id, req.body);

  if (!updatedService) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  res.status(200).json(updatedService);
});

router.delete("/:sid", async (req, res) => {
  const id = Number(req.params.sid);

  const deletedService = await serviceManager.deleteService(id);

  if (!deletedService) {
    return res.status(404).json({
      message: "Servicio no encontrado"
    });
  }

  res.status(200).json(deletedService);
});

export default router;