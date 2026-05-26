import "./QuemSomos.css";
import eu from "../assets/eu.png";
import bigas from "../assets/bigas.png";
import big from "../assets/big.png";

export default function QuemSomos() {
  return (
    <>
      <div className="topo">
        <h2>QUEM SOMOS?</h2>

        <p>
          A nossa ideia é a continuação do projeto Plantamatica, uma plataforma
          onde a comunidade do SESI 428 pode ajudar o encarregado da manutenção
          da escola, informando problemas, quando ocorreram e qual a gravidade
          de cada situação.
        </p>
      </div>

      <div className="team">
        <h1>TEAM DEV MANUTENÇÃO</h1>

        <div className="cards">
          <div className="castro">
            <img src={eu} alt="Gustavo Castro" />
            <h3>Gustavo Castro</h3>
            <p>Desenvolvedor Full Stack do projeto</p>
          </div>

          <div className="bigas">
            <img src={bigas} alt="Gabriel Rodrigues" />
            <h3>Gabriel Rodrigues</h3>
            <p>PO do projeto</p>
          </div>

          <div className="bigas">
            <img src={big} alt="Matheus Rozante" />
            <h3>Matheus Rozante</h3>
            <p>Designer Figma</p>
          </div>
        </div>
      </div>
    </>
  );
}
