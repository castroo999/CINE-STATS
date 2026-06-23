const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function buscarFilmes(nome) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${nome}`
  );

  const data = await response.json();

  return data.results;
}

export async function filmesPopulares() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`
  );

  const data = await response.json();

  return data.results;
}

export async function filmesEmCartaz() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR`
  );

  const data = await response.json();

  return data.results;
}

export async function buscarPoster(titulo) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(titulo)}`
  );

  const data = await response.json();

  return data.results?.[0] || null;
}