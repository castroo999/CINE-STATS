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

    // 1. acha usuário pelo letterboxd username
    const user = await db.get(
      `SELECT * FROM users WHERE letterboxd_user = ?`,
      [username]
    );

    if (!user) {
      return {
        username,
        filmes: 0,
        notaMedia: "0.00",
        ultimos: [],
      };
    }

    // 2. busca filmes pelo ID REAL
    const filmes = await db.all(
      `SELECT * FROM filmes_vistos WHERE user_id = ?`,
      [user.id]
    );

    const total = filmes.length;

    const media =
      filmes.reduce((acc, f) => acc + (f.rating || 0), 0) /
      (total || 1);

    return {
      username,
      filmes: total,
      notaMedia: media.toFixed(2),
      ultimos: filmes.slice(-5),
    };
  });
}