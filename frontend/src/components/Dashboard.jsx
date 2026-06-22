import "./Dashboard.css";
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

  const COLORS = ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e"];

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
            <span> Filmes Assistidos</span>
            <h2>{stats.filmes}</h2>
          </div>

          <div className="card-status">
            <span> Nota Média</span>
            <h2>{stats.notaMedia}</h2>
          </div>

          <div className="card-status">
            <span> Melhor Filme</span>
            <h2>{stats.melhorFilme?.movie_title || "-"}</h2>
          </div>

          <div className="card-status">
            <span> Pior Filme</span>
            <h2>{stats.piorFilme?.movie_title || "-"}</h2>
          </div>

          <div className="card-status">
            <span> Último Filme</span>
            <h2>{stats.ultimoFilme?.movie_title || "-"}</h2>
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

        <div className="tabela">
          <table>
            <caption>Últimos Filmes Assistidos</caption>

            <thead>
              <tr>
                <th>Filme</th>
                <th>Ano</th>
                <th>Nota</th>
                <th>Assistido em</th>
              </tr>
            </thead>

            <tbody>
              {stats.ultimos?.map((filme) => (
                <tr key={filme.id}>
                  <td>{filme.movie_title}</td>
                  <td>{filme.movie_year}</td>
                  <td>{filme.rating}</td>
                  <td>{filme.watched_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
