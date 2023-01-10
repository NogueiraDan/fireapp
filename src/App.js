import "./App.css";
import { cloneElement, useState } from "react";
import { db } from "./database.config";
import {
  addDoc,
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [titulo, setTitulo] = useState();
  const [autor, setAutor] = useState();
  const [busca, setBusca] = useState([]);
  const [idPost, setIdPost] = useState();

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("DADOS REGISTRADO NO BANCO!");
    //     setAutor('');
    //     setTitulo('');
    //   })
    //   .catch((error) => {
    //     alert("GEROU ERRO" + error);
    //   });

    // ADICIONANDO DOCUMENTO NO BANCO
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("CADASTRADO COM SUCESSO");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        alert("ERRO " + error);
      });
  }

  // Listando um POST ou VARIOS
  async function handleSearch() {
    // const postRef = doc(db, "posts", "123");
    // await getDoc(postRef)
    // .then((snapshot) => {
    //   console.log(snapshot.data());
    //   setBusca(snapshot.data());
    // })
    // .catch(() => {
    //   console.log("ERRO AO BUSCAR");
    // });
    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let busca = [];
        snapshot.forEach((doc) => {
          busca.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
          console.log(busca);
          setBusca(busca);
        });
      })
      .catch((error) => {
        console.log("ERRO AO BUSCAR" + error);
      });
  }

  async function handleUpdate() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("atualizado");
        setIdPost("");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => alert("Erro! Campo invalido ou incorreto"));
  }

  async function handleDelete(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deletado com sucesso");
      })
      .catch((err) => alert("Deu erro" + err));
  }

  return (
    <div className="App">
      <p>Fireapp</p>
      <div className="container">
        <label>Atualize um post</label>
        <input
          type="text"
          placeholder="Digite aqui o ID "
          value={idPost}
          onChange={(e) => {
            setIdPost(e.target.value);
          }}
        />
        <button className="btnSubmit" onClick={handleUpdate}>
          Atualizar
        </button>
        <br />

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
          onChange={(e) => {
            setAutor(e.target.value);
          }}
        />
        <button className="btnSubmit" onClick={handleAdd}>
          Enviar
        </button>
        <button className="btnSubmit" onClick={handleSearch}>
          Buscar todos posts
        </button>

        <div className="resultContainer">
          <ul>
            {busca.map((item) => {
              return (
                <li key={item.id}>
                  <strong>ID: {item.id}</strong>
                  <br />
                  <span>Titulo: {item.titulo} </span>
                  <br />
                  <span> Autor: {item.autor}</span>
                  <br />
                  <button onClick={() => handleDelete(item.id)}>Excluir</button>
                  <br />
                  <br />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default App;
