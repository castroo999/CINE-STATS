import "./ModalFilmes.css";
import { X } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa6";

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

      <div className="estrelas">
        {[...Array(5)].map((_, index) =>
          index < estrelas ? <FaStar key={index} /> : <FaRegStar key={index} />,
        )}
      </div>

        <p>Lançamento: {filme.release_date}</p>
      </div>
    </div>
  );
}
