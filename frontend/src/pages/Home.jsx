import { useState, useEffect } from "react";
import {
  buscarFilmes,
  filmesPopulares,
  filmesEmCartaz,
} from "../services/tmdb";
import CatalogoFilmes from "../components/CatalogoFilmes";
import ModalFilmes from "../components/ModalFilmes";
import "./Home.css";

export default function Home() {
  const [busca, setBusca] = useState("");
  const [filmes, setFilmes] = useState([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [populares, setPopulares] = useState([]);
  const [emCartaz, setEmCartaz] = useState([]);

  useEffect(() => {
    async function carregar() {
      const popularesData = await filmesPopulares();
      const cartazData = await filmesEmCartaz();

      const popularesFiltrados = popularesData.filter(
        (filme) =>
          filme.poster_path &&
          filme.original_language === "en" &&
          filme.vote_count > 500,
      );

      const cartazFiltrados = cartazData.filter(
        (filme) =>
          filme.poster_path &&
          filme.original_language === "en" &&
          filme.vote_count > 500,
      );

      setPopulares(popularesFiltrados);
      setEmCartaz(cartazFiltrados);
    }

    carregar();
  }, []);

  async function pesquisar() {
    if (!busca.trim()) return;

    const resultado = await buscarFilmes(busca);

    const filmesFiltrados = resultado.filter(
      (filme) =>
        filme.poster_path &&
        filme.vote_count > 1000,
    );

    setFilmes(filmesFiltrados);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function limpar() {
    setBusca("");
    setFilmes([]);
  }

  return (
    <div className="home-container">
      <h1 className="home-title"> Cine Stats</h1>

      <div className="busca-container">
        <input
          className="busca-input"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite um filme..."
        />

        <button className="btn btn-buscar" onClick={pesquisar}>
          Buscar
        </button>

        <button className="btn btn-limpar" onClick={limpar}>
          Limpar
        </button>
      </div>

      {filmes.length > 0 ? (
        <>
          <h2 className="titulo-catalogo">Resultados para "{busca}"</h2>

          <div className="filmes-container">
            {filmes
              .filter((filme) => filme.poster_path)
              .map((filme) => (
                <div
                  className="poster-filme"
                  key={filme.id}
                  onClick={() => setFilmeSelecionado(filme)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                    alt={filme.title}
                  />

                  <h3>{filme.title}</h3>

                  <p>{filme.release_date?.slice(0, 4)}</p>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <CatalogoFilmes
            titulo=" Filmes Populares"
            filmes={populares}
            onFilmeClick={setFilmeSelecionado}
          />

          <CatalogoFilmes
            titulo=" Em Cartaz"
            filmes={emCartaz}
            onFilmeClick={setFilmeSelecionado}
          />
        </>
      )}

      <ModalFilmes
        filme={filmeSelecionado}
        fechar={() => setFilmeSelecionado(null)}
      />
    </div>
  );
}
