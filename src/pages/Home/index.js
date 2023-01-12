import { useState } from "react";
import "./home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();

  function handleAcess() {
    if (email !== "" && senha !== "") {
      alert(`Email:${email} | Senha:${senha}`);
      setEmail("");
      setSenha("");
    } else alert("Preencha todos os campos");
  }

  return (
    <div className="homeContainer">
      <h1>MyList Todo</h1>
      <span>Sua aplicação de organização pessoal durante o dia</span>

      <form className="form">
        <label>Faça seu login</label>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button id="btnSubmit" type="submit" onClick={handleAcess}>
          Acessar
        </button>
      </form>
      <Link className="buttonRegister" to="/cadastro">
        Não possui conta? Cadastre-se
      </Link>
    </div>
  );
}
