import "./home.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../database.config";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();

  async function handleLogin(e) {
    e.preventDefault();
    if (email !== "" && senha !== "") {
      await signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
          navigate("/admin", { replace: true });
        })
        .catch((err) => {
          if (err.code == "auth/wrong-password") {
            alert("Senha incorreta");
          }
          if (err.code == "auth/user-not-found") {
            alert("Usuário não encontrado");
          }
          if (err.code == "auth/too-many-requests") {
            alert(
              "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login malsucedidas. Por favor espere um momento, e tente novamente mais tarde."
            );
          }
          console.log(err);
        });
    } else {
    }
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

        <button id="btnSubmit" type="submit" onClick={handleLogin}>
          Acessar
        </button>
      </form>
      <Link className="buttonRegister" to="/cadastro">
        Não possui conta? Cadastre-se
      </Link>
    </div>
  );
}
