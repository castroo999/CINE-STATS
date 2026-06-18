import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImportarCSV from "./ImportCSV";
import "./PerfilLetterboxd.css";

export default function PerfilLetterboxd() {
  const [username, setUsername] = useState("");
  const [perfil, setPerfil] = useState(null);

  async function conectarPerfil() {
    try {
      const token = localStorage.getItem("token");

      let cleanUsername = username;

      if (cleanUsername.includes("letterboxd.com")) {
        cleanUsername = cleanUsername
          .split("letterboxd.com/")[1]
          .replace("/", "")
          .trim();
      }

      const response = await axios.get(
        `http://localhost:3000/letterboxd/profile/${cleanUsername}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPerfil(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar perfil");
    }
  }
  return (
    <section className="perfil-container">
      <h1>Cine Stats</h1>

      <p>Digite seu usuário ou cole a URL do seu perfil Letterboxd</p>

      <div className="busca-container">
        <input
          className="busca-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="nome ou URL do perfil"
        />

        <button className="btn-buscar" onClick={conectarPerfil}>
          Conectar Perfil
        </button>
      </div>

      {perfil && (
        <div className="perfil-card">
          <h2>Perfil conectado</h2>

          <p>
            <strong>{perfil.username}</strong>
          </p>

          <p>Filmes assistidos: {perfil.filmes}</p>

          <p>Nota média: {perfil.notaMedia}</p>

          <ImportarCSV />

          <p>Filmes: {perfil.filmes}</p>
          <p>Média: {perfil.notaMedia}</p>

          <p> Melhor filme: {perfil.melhorFilme?.movie_title}</p>
          <p> Pior filme: {perfil.piorFilme?.movie_title}</p>
          <p> Último filme visto: {perfil.ultimoFilme?.movie_title}</p>
        </div>
      )}
    </section>
  );
}
