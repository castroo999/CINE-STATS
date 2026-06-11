import CardFilme from "./CardFilme";

export default function CatalogoFilmes({ filmes, titulo }) {
  return (
    <section>
      <h2>{titulo}</h2>

      <div className="filmes-container">
        {filmes.map((filme) => (
          <CardFilme
            key={filme.id}
            filme={filme}
          />
        ))}
      </div>
    </section>
  );
}