import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const LOGO_URL = "https://019ccf63-8434-7503-8556-dfae31473ccf.mochausercontent.com/logo_carbosangue.png";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        setStatus("success");
        setTimeout(() => {
          navigate("/perfil");
        }, 1500);
      } catch (err) {
        console.error("Erro na autenticação:", err);
        setStatus("error");
        setError("Ocorreu um erro durante a autenticação. Por favor, tente novamente.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-border p-12 text-center max-w-md w-full">
        <img 
          src={LOGO_URL} 
          alt="CarboSangue" 
          className="h-16 mx-auto mb-8"
        />
        
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Autenticando...
            </h2>
            <p className="text-muted-foreground">
              Aguarde enquanto finalizamos seu login
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Login realizado!
            </h2>
            <p className="text-muted-foreground">
              Redirecionando para seu perfil...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Erro na autenticação
            </h2>
            <p className="text-muted-foreground">
              {error}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
