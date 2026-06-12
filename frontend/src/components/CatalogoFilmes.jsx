import CardFilme from "./CardFilme";

export default function CatalogoFilmes({ filmes, titulo, onFilmeClick }) {
  return (
    <section>
      <h2>{titulo}</h2>

      <div className="filmes-container">
        {filmes.map((filme) => (
          <CardFilme
            key={filme.id}
            filme={filme}
            onClick={() => onFilmeClick(filme)}
          />
        ))}
      </div>
    </section>
  );
}