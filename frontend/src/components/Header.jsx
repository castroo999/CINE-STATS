import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";

function getUser() {
  try {
    //pega o usuario logado
    const user = localStorage.getItem("user");

    if (!user) return null;
    //pega somente o nome dele
    const parsed = JSON.parse(user);

    return typeof parsed === "object" && parsed.user ? parsed : null;
  } catch {
    return null;
  }
}

export default function Header() {
  const [usuario, setUsuario] = useState(getUser());
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  //função de logout
  function sair() {
    localStorage.clear();
    setUsuario(null);
    setToken(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  }

  //atualiza altomaticamente o user logado no header
  useEffect(() => {
    function atualizarDados() {
      setToken(localStorage.getItem("token"));
      setUsuario(getUser());
    }

    window.addEventListener("userChanged", atualizarDados);

    return () => {
      window.removeEventListener("userChanged", atualizarDados);
    };
  }, []);

  return (
    <header className="top-header">
      <div className="top-bar">
        <div>
          <span className="plant">PLANTAMATICA</span>
          <h1>Bem-Vindo, {usuario ? usuario.user : "visitante"}</h1>
        </div>

        <div className="perfil">
          <img src={logo} alt="Plantamatica" />
        </div>
      </div>

      <nav className="menu-bar" aria-label="Menu principal">
        <div className="menu-center">
          {!token && (
            <>
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/cadastro">Cadastrar</NavLink>
              <NavLink to="/quem-somos">Quem somos</NavLink>
            </>
          )}

          {token && (
            <>
              <NavLink to="/dashboard">Mapa</NavLink>
              <NavLink to="/chamados">Abrir chamado</NavLink>
              <NavLink to="/ver_chamados">Chamados</NavLink>
              <NavLink to="/quem-somos">Quem somos</NavLink>
            </>
          )}
        </div>

        {usuario && (
          <div className="logout-area">
            <button type="button" onClick={sair}>
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
