import fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

import { initDB } from "./db/connect.js";
import { authRoutes } from "./rotas/authRotas.js";
import { filmesRoutes } from "./rotas/filmesRotas.js";

// cria servidor
const server = fastify();

// conecta banco
const db = await initDB();

// rotas
authRoutes(server, db);
filmesRoutes(server, db);

// cors
await server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// erro global
server.setErrorHandler((error, request, reply) => {

  console.error("ERRO GLOBAL:", error);

  if (error.validation) {
    return reply.status(400).send({
      error: "Dados inválidos"
    });
  }

  return reply.status(500).send({
    error: "Erro interno do servidor"
  });
});

// iniciar servidor
server.listen({
  port: process.env.PORT || 3000
}, () => {
  console.log("Servidor rodando na porta 3000");
});