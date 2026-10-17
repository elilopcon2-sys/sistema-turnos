import { Router } from "express";
import {
  renderServices,
  renderAvailability,
  renderServiceDetail
} from "../controllers/views.controller.js";

const router = Router();

router.get("/services", renderServices);
router.get("/realtime-services", renderAvailability);
router.get("/services/:sid", renderServiceDetail);

export default router;