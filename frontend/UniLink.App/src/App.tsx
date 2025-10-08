import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/register";
import Home from "./pages/index";
import MeusLinks from "./pages/MeusLinks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/entrar" element={<Login />} />
        <Route path="/auth/cadastro" element={<Register />} />
        <Route path="/admin/painel" element={<Dashboard />} />
        <Route path="/admin/meus-links" element={<MeusLinks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
