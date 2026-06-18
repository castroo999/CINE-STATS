import { connectDB } from "../banco.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

export async function initDB() {
  const db = await connectDB();

  // USERS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      user TEXT UNIQUE,
      password TEXT,
      role TEXT,
      letterboxd_user TEXT
    )
  `);

  // FILMES VISTOS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS filmes_vistos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_title TEXT,
      movie_year TEXT,
      rating REAL,
      watched_at TEXT,
      imported_at TEXT
    )
  `);

  // ADMIN PADRÃO
  const adminExiste = await db.get(
    "SELECT * FROM users WHERE user = ?",
    ["castro"]
  );

  if (!adminExiste) {
    const id = randomUUID();
    const senha = await bcrypt.hash("Felipinho04", 10);

    await db.run(
      "INSERT INTO users (id, user, password, role) VALUES (?, ?, ?, ?)",
      [id, "castro", senha, "admin"]
    );
  }

  return db;
}