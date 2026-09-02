import express from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = express.Router();

const serviceManager = new ServiceManager();

router.get("/", (req, res) => {
    const services = serviceManager.getServices();

    res.status(200).json({
        status: "success",
        payload: services
    });
});

export default router;