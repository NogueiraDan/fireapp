import "./App.css";
import { useState } from "react";
import { db } from "./database.config";
import { doc, setDoc } from "firebase/firestore";

function App() {
  const [titulo, setTitulo] = useState();
  const [autor, setAutor] = useState();

  async function handleAdd() {
    await setDoc(doc(db, "posts", "12345"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("DADOS REGISTRADO NO BANCO!");
      })
      .catch((error) => {
        alert("GEROU ERRO" + error);
      });
  }

  return (
    <div className="App">
      <p>Fireapp</p>
      <div className="container">
        <label>Titulo</label>

        <textarea
          placeholder="Digite aqui sua tarefa..."
          maxlength="30"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
          }}
        ></textarea>

        <label>Autor</label>
        <input
          type="text"
          placeholder="Digite o nome do autor"
          value={autor}
          o
          onChange={(e) => {
            setAutor(e.target.value);
          }}
        />

        <button id="btnSubmit" onClick={handleAdd}>
          Enviar
        </button>
      </div>
    </div>
  );
}
export default App;
