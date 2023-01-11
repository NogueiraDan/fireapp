import "./App.css";
import { useEffect, useState } from "react";
import { db, auth } from "./database.config";
import {
  addDoc,
  doc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function App() {
  const [titulo, setTitulo] = useState();
  const [autor, setAutor] = useState();
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //se tem user logado
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          // se não tem user logado
          setUser(false);
          setUserDetail({});
        }
      });
    }

    checkLogin();
  }, []);

  async function handleAdd() {
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        alert("ERRO " + error);
      });
  }

  async function handleUpdate() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
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

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("Cadastrado com sucesso");
        setEmail("");
        setSenha("");
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          alert("Email já existente");
        } else if (err.code === "auth/weak-password") {
          alert("A senha precisa ter no minimo 6 caracteres");
        }
        console.log(err);
      });
  }

  async function login() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((res) => {
        alert("User logado");
        console.log(res.user);

        setUserDetail({
          uid: res.user.id,
          email: res.user.email,
        });
        setUser(true);
        setEmail("");
        setSenha("");
      })
      .catch((err) => {
        alert("Erro ao logar");
      });
  }

  async function logout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }
  return (
    <div className="App">
      {/* Fazendo o login */}
      {user && (
        <div>
          <strong>Seja bem vindo(a)! Você está logado.</strong>
          <br />
          <span>Email: {userDetail.email}</span>
          <br />
          <button onClick={logout}>Sair da conta</button>
        </div>
      )}
      <div className="container">
        <label>Email</label>
        <input
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite aqui o seu email"
        />
        <label>Senha</label>
        <input
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite aqui sua senha"
        />

        <button className="btnSubmit" onClick={novoUsuario}>
          Cadastrar Usuário
        </button>
        <button className="btnSubmit" onClick={login}>
          Fazer Login
        </button>
      </div>
      <hr />

      <div className="container">
        <h2>Cadastre um post</h2>
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
        <br />

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

        <div className="resultContainer">
          <ul>
            {posts.map((item) => {
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
