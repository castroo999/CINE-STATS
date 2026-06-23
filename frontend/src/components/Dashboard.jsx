import "./Dashboard.css";
import { buscarPoster } from "../services/tmdb";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import api from "../services/Api";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Dashboard() {
  const [stats, setStats] = useState({
    filmes: 0,
    notaMedia: 0,
    melhorFilme: null,
    piorFilme: null,
    ultimoFilme: null,
    ultimos: [],
    notas: {
      cinco: 0,
      quatro: 0,
      tres: 0,
      dois: 0,
      um: 0,
    },
  });
  const [posterMelhor, setPosterMelhor] = useState(null);
  const [posterPior, setPosterPior] = useState(null);
  const [posterUltimo, setPosterUltimo] = useState(null);
  const [postersUltimos, setPostersUltimos] = useState({});
  const COLORS = ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e"];

  useEffect(() => {
    async function carregarPosters() {
      try {
        if (stats.melhorFilme?.movie_title) {
          const filme = await buscarPoster(stats.melhorFilme.movie_title);

          setPosterMelhor(filme);
        }

        if (stats.piorFilme?.movie_title) {
          const filme = await buscarPoster(stats.piorFilme.movie_title);

          setPosterPior(filme);
        }

        if (stats.ultimoFilme?.movie_title) {
          const filme = await buscarPoster(stats.ultimoFilme.movie_title);

          setPosterUltimo(filme);
        }

        if (stats.ultimos?.length) {
          const posters = {};

          for (const filme of stats.ultimos) {
            const resultado = await buscarPoster(filme.movie_title);

            posters[filme.id] = resultado;
          }

          setPostersUltimos(posters);
        }
      } catch (error) {
        console.log(error);
      }
    }

    carregarPosters();
  }, [stats]);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/letterboxd/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    carregarDashboard();
  }, []);

  const dadosPizza = [
    {
      name: "1 estrelas",
      value: stats.notas?.um || 0,
    },
    {
      name: "2 estrelas",
      value: stats.notas?.dois || 0,
    },
    {
      name: "3 estrelas",
      value: stats.notas?.tres || 0,
    },
    {
      name: "4 estrelas",
      value: stats.notas?.quatro || 0,
    },
    {
      name: "5 estrela",
      value: stats.notas?.cinco || 0,
    },
  ];

  return (
    <>
      <div className="comeco">
        <span className="adh">🎬 Cine Stats</span>
        <h1>Dashboard do seu Letterboxd</h1>
      </div>

      <div className="container-info">
        <div className="status-cards">
          <div className="card-status">
            <span>Filmes Assistidos</span>
            <h2>{stats.filmes}</h2>
          </div>

          <div className="card-status">
            <span>Nota Média</span>
            <h2>{stats.notaMedia}</h2>
          </div>
        </div>

        <div className="destaques">
          <h2> Seus Destaques</h2>

          <div className="cards-destaques">
            <div className="poster-card">
              <span>Melhor Filme Avaliado</span>
              <img
                src={`https://image.tmdb.org/t/p/w500${posterMelhor?.poster_path}`}
                alt=""
              />
              <h3>{stats.melhorFilme?.movie_title}</h3>
            </div>

            <div className="poster-card">
              <span>Pior Filme Avaliado</span>
              <img
                src={`https://image.tmdb.org/t/p/w500${posterPior?.poster_path}`}
                alt=""
              />
              <h3>{stats.piorFilme?.movie_title}</h3>
            </div>

            <div className="poster-card">
              <span>Último Filme Visto</span>
              <img
                src={`https://image.tmdb.org/t/p/w500${posterUltimo?.poster_path}`}
                alt=""
              />
              <h3>{stats.ultimoFilme?.movie_title}</h3>
            </div>
          </div>
        </div>

        <div className="grafico">
          <h3>Distribuição das Avaliações</h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="value"
                nameKey="name"
                label
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <h3>Quantidade por Nota</h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dadosPizza}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ultimos-filmes">
          <h2>Últimos Filmes Vistos</h2>

          <Swiper slidesPerView={5} spaceBetween={20}>
            {stats.ultimos?.map((filme) => (
              <SwiperSlide key={filme.id}>
                <div className="filme-card">
                  {postersUltimos[filme.id]?.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${postersUltimos[filme.id].poster_path}`}
                      alt={filme.movie_title}
                    />
                  ) : (
                    <div className="filme-sem-poster">🎬</div>
                  )}

                  <h3>{filme.movie_title}</h3>

                  <p>{filme.movie_year}</p>

                  <span>⭐ {filme.rating}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
