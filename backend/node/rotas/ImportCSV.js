import { verificarToken } from "../middleware/auth.js";
import { parse } from "csv-parse/sync";
import { randomUUID } from "node:crypto";

export async function ImportarCSV(server, db) {
  server.post(
    "/letterboxd/import",
    { preHandler: verificarToken },
    async (request, reply) => {
      try {
        const arquivo = await request.file();

        if (!arquivo) {
          return reply.status(400).send({
            error: "Arquivo não enviado",
          });
        }

        const buffer = await arquivo.toBuffer();
        const csvText = buffer.toString("utf-8");

        const records = parse(csvText, {
          columns: true,
          skip_empty_lines: true,
        });

        const filmes = records.map((f) => ({
          titulo: f.Name,
          ano: f.Year,
          nota: Number(f.Rating) || null,
          data_assistido: f.Date,
        }));

        for (const filme of filmes) {
          await db.run(
            `
            INSERT INTO filmes_vistos (
              id,
              user_id,
              movie_title,
              movie_year,
              rating,
              watched_at,
              imported_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
              randomUUID(),
              request.user.id,
              filme.titulo,
              filme.ano,
              filme.nota,
              filme.data_assistido,
              new Date().toISOString(),
            ]
          );
        }

        return reply.status(200).send({
          message: "Importação concluída com sucesso",
          total_filmes: filmes.length,
        });
      } catch (error) {
        console.log("ERRO IMPORT CSV:", error);

        return reply.status(500).send({
          error: "Erro ao processar CSV",
        });
      }
    }
  );
}