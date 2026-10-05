import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { envConfig } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";

const startServer = async () => {
  await connectDB();

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  app.set("io", io);

  httpServer.listen(envConfig.port, () => {
    console.log(`Servidor escuchando en el puerto ${envConfig.port}`);
  });
};

startServer();