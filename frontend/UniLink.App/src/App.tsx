import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/features/dashboard/pages";
import Login from "@/features/auth/pages/login";
import Register from "@/features/auth/pages/register";
import Home from "./features/home/index";
import MeusLinks from "@/features/links/pages/meus-links";
import Perfil from "@/features/profile/pages/perfil";
import PublicProfile from "@/features/public-profile/pages";
import NotFound from "@/features/not-found/pages";
import { GuestRoute } from "@/features/auth/components/GuestRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/entrar" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/auth/cadastro" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/admin/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/meus-links" element={<ProtectedRoute><MeusLinks /></ProtectedRoute>} />
        <Route path="/admin/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/public/:username" element={<PublicProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
