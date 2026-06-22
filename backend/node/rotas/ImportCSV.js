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

        let csvText = buffer.toString("utf-8");

        csvText = csvText.trim();

        console.log(csvText.slice(0, 500));

        const records = parse(csvText, {
          columns: true,
          skip_empty_lines: true,
          bom: true,
          relax_column_count: true,
        });

        console.log("TOTAL REGISTROS:", records.length);

        if (records.length > 0) {
          console.log(records[0]);
        }

        // apaga importação anterior do usuário
        await db.run(
          "DELETE FROM filmes_vistos WHERE user_id = ?",
          [request.user.id]
        );

        const filmes = records.map((f) => ({
          titulo: f["Name"],
          ano: f["Year"],
          nota: Number(f["Rating"]) || null,
          data_assistido: f["Watched Date"] || f["Date"] || null,
        }));

        console.log("FILMES PARA IMPORTAR:", filmes.length);

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

        return reply.send({
          message: "Importação concluída com sucesso",
          total: filmes.length,
        });
      } catch (err) {
        console.log("ERRO IMPORT:", err);

        return reply.status(500).send({
          error: "Erro no import",
        });
      }
    }
  );
}