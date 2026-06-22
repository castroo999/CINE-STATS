import { useState } from "react";
import PerfilLetterboxd from "../components/PerfilLetterboxd";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [perfilConectado, setPerfilConectado] = useState(false);
  console.log("perfilConectado:", perfilConectado);

  return (
    <div className="home-container">
      <PerfilLetterboxd onPerfilConectado={setPerfilConectado} />

      {perfilConectado && <Dashboard />}
    </div>
  );
}