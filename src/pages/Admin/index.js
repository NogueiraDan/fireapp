import { useState, useEffect } from "react";
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
  updateDoc,
} from "firebase/firestore";

export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState();
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState({});
  const [tarefas, setTarefas] = useState([]);
  const [email, setEmail] = useState();

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
              time: doc.data().createdAt * 1000,
            });
          });

          setTarefas(lista);
        });
      }
    }
    loadTarefas();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@detailUser"));
    setEmail(user.email);
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (!tarefaInput) {
      alert("CAMPO VAZIO! Preencha algo para prosseguir.");
      return;
    }

    if (edit?.id) {
      handleEditUpdate();
      return;
    }
    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      createdAt: new Date(),
      UID: user?.uid,
    })
      .then(() => {
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

  async function handleEdit(item) {
    console.log(item);
    setTarefaInput(item.tarefa);
    setEdit(item);
  }
  async function handleEditUpdate() {
    const docRef = doc(db, "tarefas", edit?.id);
    await updateDoc(docRef, {
      tarefa: tarefaInput,
    })
      .then(() => {
        console.log("Tarefa atualizada");
        setTarefaInput("");
        setEdit({});
      })
      .catch((err) => {
        console.log(err);
        setTarefaInput("");
        setEdit({});
      });
  }

  return (
    <div className="adminContainer">
      <h1>Minhas tarefas</h1>
      <h2>Bem vindo, {user.email}</h2>
      <form onSubmit={handleRegister}>
        <textarea
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
          placeholder="Digite sua tarefa..."
        />

        {Object.keys(edit).length > 0 ? (
          <button
            type="submit"
            className="btnRegister"
            style={{ backgroundColor: "#2aa177" }}
          >
            Atualizar minha tarefa
          </button>
        ) : (
          <button type="submit" className="btnRegister">
            Registrar tarefa
          </button>
        )}
      </form>
      <h3>Tarefas pendentes: {tarefas.length}</h3>

      {tarefas.map((item) => {
        return (
          <article key="item.id" className="list">
            <p>{item.tarefa}</p>       
            <div>
              <button onClick={() => handleEdit(item)}>Editar</button>
              <button className="btnDone" onClick={() => handleDelete(item.id)}>
                Concluir
              </button>
            </div>
          </article>
        );
      })}

      {/* <div className="tasks_container">
        <div id="todo" className="todo_container">
          <span className="title_tasks">Para fazer</span>
          {tarefas.map((item) => {
            return (
              <article key="item.id" className="list" draggable="true">
                <p>{item.tarefa}</p>
                <div>
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button
                    className="btnDone"
                    onClick={() => handleDelete(item.id)}
                  >
                    Concluir
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div id="progress" className="progress_container">
          <span className="title_tasks">Em andamento</span>
        </div>
        <div id="done" className="done_container">
          <span className="title_tasks">Concluídas</span>
        </div>
      </div> */}

      <button className="btnLogout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
