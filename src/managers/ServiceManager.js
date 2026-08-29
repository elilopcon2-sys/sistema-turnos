import services from "../data/services.json" with { type: "json" };
import fs from "fs";

class ServiceManager {

    getServices() {
    return services;
  }

  getServiceById(id) {
  return services.find(service => service.id === id)|| null;
  }

  saveServices() {
  fs.writeFileSync(
    "./src/data/services.json",
    JSON.stringify(services, null, 2)
  );
  }
  
  addService(serviceData) {

  if (
    !serviceData.name ||
    !serviceData.description ||
    !serviceData.duration ||
    !serviceData.price ||
    !serviceData.category ||
    serviceData.available === undefined
  ) {
    return null;
  }

  const newId = services.length
    ? Math.max(...services.map(service => service.id)) + 1
    : 1;

  const newService = {
    id: newId,
    ...serviceData
  };

  services.push(newService);

  this.saveServices();

  return newService;
  }

  updateService(id, updatedData) {
  const index = services.findIndex(service => service.id === id);

  if (index === -1) {
    return null;
  }

  const updatedService = {
    ...services[index],
    ...updatedData,
    id: services[index].id
  };


  services[index] = updatedService;
  this.saveServices();

  return updatedService;
  }

  deleteService(id) {
  const index = services.findIndex(service => service.id === id);

  if (index === -1) {
    return null;
  }

  const deletedService = services.splice(index, 1);
  this.saveServices();

  return deletedService[0];
  }
}

export default ServiceManager;