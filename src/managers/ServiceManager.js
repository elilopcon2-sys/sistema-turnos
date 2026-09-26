import fs from "fs/promises";

class ServiceManager {

  async readServices() {
  try {
    const data = await fs.readFile(
      "./src/data/services.json",
      "utf-8"
    );

    return JSON.parse(data);

  } catch (error) {
    console.log("Error al leer los servicios:", error.message);
    return [];
  }
}

    async getServices() {
    return await this.readServices();
  }

   async getServiceById(id) {
    const services = await this.readServices();

    return services.find(service => service.id === id)|| null;
  }

   async writeServices(services) {
   await fs.writeFile(
    "./src/data/services.json",
    JSON.stringify(services, null, 2)
  );
  }
  
  async addService(serviceData) {

    if (
    !serviceData ||
    typeof serviceData.name !== "string" ||
    serviceData.name.trim() === "" ||
    typeof serviceData.description !== "string" ||
    serviceData.description.trim() === "" ||
    !Number.isFinite(serviceData.duration) ||
    serviceData.duration <= 0 ||
    !Number.isFinite(serviceData.price) ||
    serviceData.price < 0 ||
    typeof serviceData.category !== "string" ||
    serviceData.category.trim() === "" ||
    typeof serviceData.available !== "boolean"
   ) {
    return null;
   }

   const services = await this.readServices();

    const newId = services.length
    ? Math.max(...services.map(service => service.id)) + 1
    : 1;

   const newService = {
    id: newId,
    name: serviceData.name,
    description: serviceData.description,
    duration: serviceData.duration,
    price: serviceData.price,
    category: serviceData.category,
    available: serviceData.available
  };

  services.push(newService);

  await this.writeServices(services);

  return newService;
  }

  async updateService(id, updatedData) {

    const services = await this.readServices();    
    const index = services.findIndex(service => service.id === id);

    if (index === -1) {
    return null;
  }

    const updatedService = {
    ...services[index],
    ...updatedData,
    id: services[index].id
  };
  if (
    typeof updatedService.name !== "string" ||
    updatedService.name.trim() === "" ||
    typeof updatedService.description !== "string" ||
    updatedService.description.trim() === "" ||
    !Number.isFinite(updatedService.duration) ||
    updatedService.duration <= 0 ||
    !Number.isFinite(updatedService.price) ||
    updatedService.price < 0 ||
    typeof updatedService.category !== "string" ||
    updatedService.category.trim() === "" ||
    typeof updatedService.available !== "boolean"
  ) {
    throw new Error("Los datos del servicio son inválidos");
  }
    services[index] = updatedService;
    await this.writeServices(services);
  

    return updatedService;
  }

    async deleteService(id) {
    const services = await this.readServices();  
    const index = services.findIndex(service => service.id === id);

    if (index === -1) {
    return null;
   } 

    const deletedService = services.splice(index, 1);
    await this.writeServices(services);

    return deletedService[0];
  }
}

export default ServiceManager;