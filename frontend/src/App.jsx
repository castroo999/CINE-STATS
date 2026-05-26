import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroUser from "./pages/CadastroUser";
import Cadastro from "./pages/Cadastro";
import Servicos from "./components/Servicos";
import VerServico from "./pages/VerServico";
import CardInicial from "./components/CardInicial";
import Modelos from "./pages/Modelos";
import QuemSomos from "./pages/QuemSomos";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<CadastroUser />} />

        <Route
          path="/dashboard"
          element={token ? <CardInicial /> : <Navigate to="/login" />}
        />

        <Route
          path="/chamados"
          element={token ? <Cadastro /> : <Navigate to="/login" />}
        />

        <Route
          path="/ver_chamados"
          element={token ? <VerServico /> : <Navigate to="/login" />}
        />

        <Route
          path="/quem-somos"
          element={<QuemSomos />}
        />
      </Routes>

      <Footer />
    </>
  );
}
