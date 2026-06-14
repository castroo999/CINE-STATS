import './CardFilme.css'
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

export default function CardFilme({ filme, onClick }) {
  const estrelas = Math.round((filme.vote_average || 0) / 2);

  return (
    <div className="poster-filme" onClick={onClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
        alt={filme.title}
      />

      <h3>{filme.title}</h3>

      <div className="estrelas">
        {[...Array(5)].map((_, index) =>
          index < estrelas ? <FaStar key={index} /> : <FaRegStar key={index} />,
        )}
      </div>
    </div>
  );
}
