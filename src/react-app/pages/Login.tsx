import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/react-app/components/Header";

export default function LoginPage() {
  const { user, isPending, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && !isPending) {
      navigate("/perfil");
    }
  }, [user, isPending, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/50">
      <Header />
      
      <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-red-600 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Entrar</h1>
              <p className="text-white/80 mt-2">
                Acesse sua conta para gerenciar suas doações
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">E-mail</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    placeholder="joao@email.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Senha</label>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                    placeholder="••••••••" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-4 font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 mt-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar na minha conta"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Ainda não tem conta?{" "}
                  <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                    Cadastre-se
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link 
                  to="/"
                  className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o início
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}