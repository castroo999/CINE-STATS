import { verificarToken } from "../middleware/auth.js";

export async function userLetterboxd(server, db) {

  // SYNC username
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


  server.get("/letterboxd/profile/:username", async (request) => {
    const { username } = request.params;

    // 1. acha usuário
    const user = await db.get(
      `SELECT * FROM users WHERE letterboxd_user = ?`,
      [username]
    );

    if (!user) {
      return {
        username,
        filmes: 0,
        notaMedia: "0.00",
        melhorFilme: null,
        piorFilme: null,
        ultimoFilme: null,
        ultimos: [],
      };
    }

    // 2. busca filmes
    const filmes = await db.all(
      `SELECT * FROM filmes_vistos WHERE user_id = ?`,
      [user.id]
    );

    const total = filmes.length;

    // 3. média
    const media =
      filmes.reduce((acc, f) => acc + (f.rating || 0), 0) /
      (total || 1);

    // 4. melhor filme
    const melhorFilme = filmes.reduce((best, f) =>
      (f.rating || 0) > (best?.rating || 0) ? f : best,
      null
    );

    // 5. pior filme
    const piorFilme = filmes.reduce((worst, f) =>
      (f.rating || 0) < (worst?.rating || 10) ? f : worst,
      null
    );

    // 6. último assistido (por data)
    const ultimoFilme = [...filmes].sort((a, b) =>
      new Date(b.watched_at) - new Date(a.watched_at)
    )[0];

    // 7. últimos 5
    const ultimos = filmes
      .sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at))
      .slice(0, 5);

    return {
      username,
      filmes: total,
      notaMedia: media.toFixed(2),
      melhorFilme,
      piorFilme,
      ultimoFilme,
      ultimos,
    };
  });
}