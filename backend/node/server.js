/* global process */

import fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { initDB } from "./db/connect.js";
import { authRoutes } from "./rotas/authRotas.js";
import { filmesRoutes } from "./rotas/filmesRotas.js";
import { userLetterboxd } from './rotas/LetterboxdRotas.js'
import { userRota } from "./rotas/userRotas.js";
import { ImportarCSV } from './rotas/ImportCSV.js';
import multipart from "@fastify/multipart";

// cria servidor
const server = fastify();

// conecta banco
const db = await initDB();

// cors
await server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

ImportarCSV(server, db);
userRota(server, db);
userLetterboxd(server, db);
authRoutes(server, db);
filmesRoutes(server, db);

await server.register(multipart);

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


server.get("/ping-letterboxd", async () => {
  return { ok: true };
});
// iniciar servidor
server.listen({
  port: process.env.PORT || 3000
}, () => {
  console.log("Servidor rodando na porta 3000");
});