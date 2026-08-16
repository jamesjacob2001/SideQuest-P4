import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import app from "./app.js";
import {
  closeDatabaseConnection,
  connectToDatabase,
} from "./config/database.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);

dotenv.config({
  path: resolve(currentDirectory, "../.env"),
});

function parsePort(value) {
  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : null;
}

// Railway injects PORT (often 8080) while the public domain may target 3000.
const PUBLIC_PORT = 3000;
const listenPorts = [
  ...new Set([parsePort(process.env.PORT) ?? PUBLIC_PORT, PUBLIC_PORT]),
];

function listenOnPort(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`SideQuest server running on port ${port}`);
      resolve(server);
    });

    server.on("error", reject);
  });
}

function closeServer(server) {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function startServer() {
  try {
    await connectToDatabase();

    const servers = [];

    for (const port of listenPorts) {
      servers.push(await listenOnPort(port));
    }

    async function shutDown(signal) {
      console.log(`\n${signal} received. Closing SideQuest server...`);

      await Promise.all(servers.map((server) => closeServer(server)));
      await closeDatabaseConnection();
      console.log("Server and MongoDB connection closed.");
      process.exit(0);
    }

    process.on("SIGINT", () => shutDown("SIGINT"));
    process.on("SIGTERM", () => shutDown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start SideQuest server:", error.message);
    process.exit(1);
  }
}

startServer();
