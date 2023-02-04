import { useState, useEffect } from "react";
import { auth } from "../database.config";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Private({ children }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const showToastMessage = () => {
    toast.info("Usuário deslogado", {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };

  useEffect(() => {    
    
    // Verificar se tem usuario Logado ou não
    async function checkLogin() {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
          };

          localStorage.setItem("@detailUser", JSON.stringify(userData));
          setLoading(false);
          setSigned(true);
        } else {
          setLoading(false);
          setSigned(false);
        }
      });
    }

    checkLogin();
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (!signed) {
    showToastMessage();
    return <Navigate to="/" />;
  }

  return children;
}
