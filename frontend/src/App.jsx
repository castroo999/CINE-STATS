import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroUser from "./pages/CadastroUser";
import Cadastro from "./pages/Cadastro";
// import VerChamado from "./pages/Perfil";
// import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUser />} />

        <Route
          path="/seu_perfil"
          element={
            <ProtectedRoute>
              {/* <Perfil /> */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/suas_avaliacoes"
          element={
            <ProtectedRoute>
              {/* <VerChamado /> */}
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
