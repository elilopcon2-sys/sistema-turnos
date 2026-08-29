import "dotenv/config";

const requiredEnvVariables = ["PORT", "NODE_ENV"];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Falta la variable de entorno: ${variable}`);
  }
}