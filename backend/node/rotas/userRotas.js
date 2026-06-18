import { verificarToken } from "../middleware/auth.js";

export async function userRota(server, db) {
    server.get('/me',
        {preHandler: verificarToken},
        async (request) =>{
            const usuario = await db.get(
                `
                SELECT
                id,
                user,
                role,
                letterboxd_user
                FROM users
                WHERE id = ?
                `,
                [request.user.id]
            )

            return usuario
        }
    )
}