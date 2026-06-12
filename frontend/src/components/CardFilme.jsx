export default function CardFilme({ filme, onClick }) {
  const estrelas = Math.round(filme.vote_average / 2);

  return (
    <div className="poster-filme" onClick={onClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
        alt={filme.title}
      />

      <h3>{filme.title}</h3>

      <p className="estrelas">
        {"⭐".repeat(estrelas)}
        {"☆".repeat(5 - estrelas)}
      </p>
    </div>
  );
}