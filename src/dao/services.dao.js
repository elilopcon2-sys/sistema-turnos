import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATH = path.join(__dirname, "../data/services.json");

class ServicesDao {

async getAll() {
    try {
      const data = await fs.readFile(PATH, "utf-8");

      return JSON.parse(data);

    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }
  
async getById(id) {
  const services = await this.getAll();

  return services.find(
    service => service.id === id
  ) || null;
}

async create(data) {
  const services = await this.getAll();

  const newId = services.length
    ? Math.max(...services.map(service => service.id)) + 1
    : 1;

 const newService = {
  ...data,
  id: newId
};

  services.push(newService);

  await fs.writeFile(
    PATH,
    JSON.stringify(services, null, 2)
  );

  return newService;
}

async update(id, data) {
  const services = await this.getAll();

  const index = services.findIndex(
    service => service.id === id
  );

  if (index === -1) {
    return null;
  }

  const updatedService = {
    ...services[index],
    ...data,
    id: services[index].id
  };

  services[index] = updatedService;

  await fs.writeFile(
    PATH,
    JSON.stringify(services, null, 2)
  );

  return updatedService;
}
async delete(id) {
  const services = await this.getAll();

  const index = services.findIndex(
    service => service.id === id
  );

  if (index === -1) {
    return null;
  }

  const deletedService = services.splice(index, 1)[0];

  await fs.writeFile(
    PATH,
    JSON.stringify(services, null, 2)
  );

  return deletedService;
}
}

export default ServicesDao;