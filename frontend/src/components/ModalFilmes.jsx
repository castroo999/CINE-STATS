import "./ModalFilmes.css";
import { X, Star } from "lucide-react";

export default function ModalFilmes({ filme, fechar }) {
  if (!filme) return null;
  const estrelas = Math.round((filme?.vote_average || 0) / 2);

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={fechar}>
          <X />
        </button>

        <div className="img-container">
          <img
            src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
            alt={filme.title}
          />
        </div>
        

        <h2>{filme.title}</h2>

        <p>{filme.overview}</p>

        <p className="estrelas">
          {"⭐".repeat(estrelas)}
          {"☆".repeat(5 - estrelas)}
        </p>

        <p>Lançamento: {filme.release_date}</p>
      </div>
    </div>
  );
}
