
import ServiceManager from "./managers/ServiceManager.js";
import "./config/env.config.js";


const serviceManager = new ServiceManager();

console.log("Puerto:", process.env.PORT);
console.log("Entorno:", process.env.NODE_ENV);