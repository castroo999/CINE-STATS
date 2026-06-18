import { useState } from "react";
import axios from "axios";
import './ImportCSV.css'

export default function ImportarCSV() {
  const [arquivo, setArquivo] = useState(null);

  async function importar() {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("csv", arquivo);

    await axios.post(
      "http://localhost:3000/letterboxd/import",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Importado com sucesso");
  }

  return (
    <>
      <input
        className="select-arquivo"
        type="file"
        accept=".csv"
        onChange={(e) => setArquivo(e.target.files[0])}
      />

      <button className="import" onClick={importar}>
        Importar CSV
      </button>
    </>
  );
}