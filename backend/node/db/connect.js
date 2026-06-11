import { connectDB } from "../banco.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

export async function initDB() {
  const db = await connectDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      user TEXT,
      password TEXT,
      role TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS filmes_vistos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id INTEGER NOT NULL,
      movie_title TEXT NOT NULL,
      poster_path TEXT,
      rating REAL,
      review TEXT,
      watched_at TEXT,
      created_at TEXT
    )
  `);

  const adminExiste = await db.get(
    "SELECT * FROM user WHERE user = ?",
    ["castro"]
  );

  if (!adminExiste) {
    const id = randomUUID();

    const senha = await bcrypt.hash(
      "Felipinho04",
      10
    );

    await db.run(
      "INSERT INTO user (id, user, password, role) VALUES (?, ?, ?, ?)",
      [id, "castro", senha, "admin"]
    );
  }

  return db;
}