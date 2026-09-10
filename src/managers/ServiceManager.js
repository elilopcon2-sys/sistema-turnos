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
    !serviceData.name ||
    !serviceData.description ||
    !serviceData.duration ||
    !serviceData.price ||
    !serviceData.category ||
    serviceData.available === undefined
  ) {
    return null;
  }

   const services = await this.readServices();

    const newId = services.length
    ? Math.max(...services.map(service => service.id)) + 1
    : 1;

   const newService = {
    id: newId,
    ...serviceData
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