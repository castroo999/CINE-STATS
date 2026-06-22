import { verificarToken } from "../middleware/auth.js";

export async function userLetterboxd(server, db) {
  // CONECTAR PERFIL
  server.post(
    "/letterboxd/sync",
    { preHandler: verificarToken },
    async (request, reply) => {
      const { username } = request.body;

      if (!username) {
        return reply.status(400).send({
          error: "Informe um usuário do Letterboxd",
        });
      }

      await db.run(
        `
        UPDATE users
        SET letterboxd_user = ?
        WHERE id = ?
        `,
        [username, request.user.id]
      );

      return reply.send({
        message: "Perfil conectado com sucesso",
        username,
      });
    }
  );

  // DASHBOARD LETTERBOXD
  server.get(
    "/letterboxd/profile",
    { preHandler: verificarToken },
    async (request) => {
      const filmes = await db.all(
        `
        SELECT *
        FROM filmes_vistos
        WHERE user_id = ?
        `,
        [request.user.id]
      );

      const total = filmes.length;

      const media =
        filmes.reduce((acc, filme) => {
          return acc + (filme.rating || 0);
        }, 0) / (total || 1);

      const melhorFilme = filmes.reduce(
        (best, filme) =>
          (filme.rating || 0) > (best?.rating || 0)
            ? filme
            : best,
        null
      );

      const piorFilme = filmes.reduce(
        (worst, filme) =>
          (filme.rating || 0) < (worst?.rating || 10)
            ? filme
            : worst,
        null
      );

      const filmesOrdenados = [...filmes].sort(
        (a, b) =>
          new Date(b.watched_at) -
          new Date(a.watched_at)
      );

      const ultimoFilme = filmesOrdenados[0] || null;

      const ultimos = filmesOrdenados.slice(0, 5);

      const notas = {
        cinco: filmes.filter((f) => Number(f.rating) >= 5).length,

        quatro: filmes.filter(
          (f) =>
            Number(f.rating) >= 4 &&
            Number(f.rating) < 5
        ).length,

        tres: filmes.filter(
          (f) =>
            Number(f.rating) >= 3 &&
            Number(f.rating) < 4
        ).length,

        dois: filmes.filter(
          (f) =>
            Number(f.rating) >= 2 &&
            Number(f.rating) < 3
        ).length,

        um: filmes.filter(
          (f) => Number(f.rating) < 2
        ).length,
      };

      return {
        filmes: total,
        notaMedia: media.toFixed(2),
        melhorFilme,
        piorFilme,
        ultimoFilme,
        ultimos,
        notas,
      };
    }
  );
}