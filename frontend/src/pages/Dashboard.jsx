import "./Dashboard.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/Api";

export default function Dash() {
  const [stats, setStats] = useState({
    usuarios: 0,
    chamados: 0,
    abertos: 0,
    andamento: 0,
    resolvidos: 0,
  });

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [statsResponse, usuariosResponse] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/usuarios"),
        ]);

        setStats(statsResponse.data);
        setUsuarios(usuariosResponse.data);
      } catch (error) {
        console.log(error);
      }
    }

    carregarDados();
  }, []);

  async function deletarUsuario(id) {
    try {
      await api.delete(`/admin/usuarios/${id}`);

      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));

      setStats((prev) => ({
        ...prev,
        usuarios: prev.usuarios - 1,
      }));
      toast.success("Usuario deletado com sucesso!")

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="comeco">
        <span className="adh">Bem Vindo Castro</span>
        <h1>Dashboard de vizualização geral do projeto</h1>
      </div>

      <div className="container-info">
        <div className="status-cards">
          <div className="card-status">
            <span> Usuários</span>
            <h2>{stats.usuarios}</h2>
          </div>

          <div className="card-status">
            <span> Chamados</span>
            <h2>{stats.chamados}</h2>
          </div>

          <div className="card-status">
            <span> Abertos</span>
            <h2>{stats.abertos}</h2>
          </div>

          <div className="card-status">
            <span> Em andamento</span>
            <h2>{stats.andamento}</h2>
          </div>

          <div className="card-status">
            <span> Resolvidos</span>
            <h2>{stats.resolvidos}</h2>
          </div>
        </div>

        <div className="grafico">
          <h3>Taxa de resolução:</h3>
          <p>aq vai o grafico</p>
        </div>

        <div className="tabela">
  <table>
    <caption>Gerenciamento de Usuários e Chamados</caption>

    <thead>
      <tr>
        <th>Usuário</th>
        <th>Cargo</th>
        <th>Chamados</th>
        <th>Ações</th>
      </tr>
    </thead>

    <tbody>
      {usuarios.map((usuario) => (
        <tr key={usuario.id}>
          <td>{usuario.user}</td>
          <td>{usuario.role}</td>
          <td>
            <span>
              {usuario.chamados}
            </span>
          </td>

          <td>
            {usuario.user === "castro" ? (
              <span className="protegido">
                🔒 Protegido
              </span>
            ) : (
              <button
                type="button"
                className="btn-excluir"
                onClick={() => deletarUsuario(usuario.id)}
              >
                Excluir
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    </>
  );
}
