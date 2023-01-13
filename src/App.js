import { BrowserRouter } from "react-router-dom";
import RoutesApp from "../src/Routes/routes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <BrowserRouter>
      <RoutesApp />
      <ToastContainer />
    </BrowserRouter>
  );
}
