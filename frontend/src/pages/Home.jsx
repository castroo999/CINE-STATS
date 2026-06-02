import "./Home.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home-page">
      <div className="home-conteudo">
        <div className="home">
          <span className="home-label">Manutencao escolar</span>
          <h2>Bem-vindo ao SESI-tech</h2>
          <p>
            Registre chamados, acompanhe manutencoes e ajude a organizar os
            cuidados com os espacos da escola.
          </p>

          <div className="home-link">
            <Link className="login" to="/login">
              Fazer login
            </Link>

            <Link className="criar" to="/cadastro">
              Criar conta
            </Link>
          </div>
        </div>

        <div className="home-logo-card">
          <img src={logo} alt="Logo Plantamatica" />
        </div>
      </div>
    </section>
  );
}
