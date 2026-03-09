import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/react-app/contexts/AuthContext";
import HomePage from "@/react-app/pages/Home";
import TriagemPage from "@/react-app/pages/Triagem";
import LoginPage from "@/react-app/pages/Login";
import CadastroPage from "@/react-app/pages/Cadastro";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import PerfilPage from "@/react-app/pages/Perfil";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/triagem" element={<TriagemPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
