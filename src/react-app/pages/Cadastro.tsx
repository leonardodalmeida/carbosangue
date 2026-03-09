import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { ArrowLeft, Loader2, Droplets, CheckCircle2 } from "lucide-react";
import Header from "@/react-app/components/Header";

const LOGO_URL = "https://019ccf63-8434-7503-8556-dfae31473ccf.mochausercontent.com/logo_carbosangue.png";

const benefits = [
  "Acompanhe suas doações",
  "Receba lembretes personalizados",
  "Veja o impacto das suas doações",
  "Acesse informações exclusivas",
];

export default function CadastroPage() {
  const { user, isPending, register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Campos do form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && !isPending) navigate("/perfil");
  }, [user, isPending, navigate]);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isPending) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/50">
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Benefícios */}
            <div className="bg-gradient-to-br from-primary to-red-600 rounded-3xl p-8 text-white hidden lg:flex flex-col justify-center">
              <Droplets className="w-12 h-12 mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Junte-se a nós</h2>
              <p className="text-white/80 mb-8">Crie sua conta e faça parte da maior rede de doadores da Região Carbonífera.</p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-border overflow-hidden">
              <div className="p-8">
                <img src={LOGO_URL} alt="CarboSangue" className="h-14 mb-4" />
                <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
                <p className="text-muted-foreground mt-2 mb-6">Cadastre-se para começar a salvar vidas</p>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

                <form onSubmit={handleCadastro} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="João da Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="joao@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="••••••••" />
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-4 font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar minha conta"}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Já tem uma conta? <Link to="/login" className="text-primary font-semibold hover:underline">Entrar</Link>
                </div>
                <div className="mt-8 pt-6 border-t border-border">
                  <Link to="/" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar para o início
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}