import { randomUUID } from "node:crypto";
import { verificarToken } from "../middleware/auth.js";

export async function filmesRoutes(server, db) {

  // cadastrar filme assistido
  server.post(
    "/filmes",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        const {
          movie_id,
          movie_title,
          poster_path,
          rating,
          review
        } = request.body;

        const id = randomUUID();

        await db.run(
          `
          INSERT INTO filmes_vistos
          (
            id,
            user_id,
            movie_id,
            movie_title,
            poster_path,
            rating,
            review,
            watched_at,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id,
            request.user.id,
            movie_id,
            movie_title,
            poster_path,
            rating,
            review,
            new Date().toISOString(),
            new Date().toISOString()
          ]
        );

        return reply.status(201).send({
          message: "Filme registrado"
        });

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao registrar filme"
        });
      }
    }
  );

  // listar filmes do usuário
  server.get(
    "/filmes",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        const filmes = await db.all(
          `
          SELECT *
          FROM filmes_vistos
          WHERE user_id = ?
          ORDER BY watched_at DESC
          `,
          [request.user.id]
        );

        return filmes;

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao listar filmes"
        });
      }
    }
  );

  // editar avaliação
  server.put(
    "/filmes/:id",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        const { id } = request.params;

        const {
          rating,
          review
        } = request.body;

        await db.run(
          `
          UPDATE filmes_vistos
          SET
            rating = ?,
            review = ?
          WHERE id = ?
          `,
          [rating, review, id]
        );

        return {
          message: "Filme atualizado"
        };

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao atualizar"
        });
      }
    }
  );

  // deletar
  server.delete(
    "/filmes/:id",
    { preHandler: verificarToken },
    async (request, reply) => {

      try {

        const { id } = request.params;

        await db.run(
          "DELETE FROM filmes_vistos WHERE id = ?",
          [id]
        );

        return {
          message: "Filme removido"
        };

      } catch (error) {

        console.log(error);

        return reply.status(500).send({
          error: "Erro ao remover"
        });
      }
    }
  );
}