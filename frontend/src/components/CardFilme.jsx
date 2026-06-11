export default function CardFilme({ filme }) {
  return (
    <div className="poster-filme">
      <img
        src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
        alt={filme.title}
      />

      <h3>{filme.title}</h3>

      <p> {filme.vote_average?.toFixed(1)}</p>
    </div>
  );
}