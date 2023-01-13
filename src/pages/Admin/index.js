import { useState, useEffect, useInsertionEffect } from "react";
import "./admin.css";
import { auth, db } from "../../database.config";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState();
  const [user, setUser] = useState({});
  const [tarefas, setTarefas] = useState([]);
  console.log(tarefas);

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));
      if (userDetail) {
        // Dados do usuário logado
        const data = JSON.parse(userDetail);
        //Tarefas oriundas do banco
        const tarefasRef = collection(db, "tarefas");
        const q = query(
          tarefasRef,
          orderBy("createdAt", "desc"),
          where("UID", "==", data?.uid)
        );
        // Monitorando as tarefas em realtime
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              UID: doc.data().UID,
            });
          });

          setTarefas(lista);
          console.log(lista);
        });
      }
    }

    loadTarefas();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (!tarefaInput) {
      alert("CAMPO VAZIO! Digite algo.");
      return;
    }
    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      createdAt: new Date(),
      UID: user?.uid,
    })
      .then(() => {
        alert("Tarefa registrada");
        setTarefaInput("");
      })
      .catch((err) => {
        console.log("Erro " + err);
      });
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleDelete(id) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  return (
    <div className="adminContainer">
      <h1>Minhas tarefas</h1>
      <form onSubmit={handleRegister}>
        <textarea
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
          placeholder="Digite sua tarefa"
        />

        <button type="submit" className="btnRegister" onClick={handleRegister}>
          Registrar tarefa
        </button>
      </form>

      {tarefas.map((item) => {
        return (
          <article key="item.id" className="list">
            <p>{item.tarefa}</p>
            <div>
              <button>Editar</button>
              <button className="btnDone" onClick={() => handleDelete(item.id)}>
                Concluir
              </button>
            </div>
          </article>
        );
      })}

      <button className="btnLogout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
