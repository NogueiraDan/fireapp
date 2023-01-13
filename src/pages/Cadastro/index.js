import { useState } from "react";
import "./cadastro.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../database.config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const showToastMessage = () => {
    toast.success("Cadastro concluído com sucesso", {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 3000,
    });
  };

  async function handleRegister(e) {
    e.preventDefault();
    if (email !== "" && senha !== "") {
      await createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
          showToastMessage();
          navigate("/admin", { replace: true });
        })
        .catch((err) => {
          console.log("Algo deu errado" + err);
        });
    } else {
    }
  }

  return (
    <div className="cadastroContainer">
      <h1>Faça seu cadastro</h1>
      <span>Crie sua conta e começe gerenciar sua rotina</span>
      <form className="formCadastro">
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

        <button id="btnSubmit" type="submit" onClick={handleRegister}>
          Cadastre-se
        </button>
      </form>
      <Link className="buttonRegister" to="/">
        Já possui conta? Faça Login!
      </Link>
    </div>
  );
}
