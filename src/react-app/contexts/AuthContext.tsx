import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: any;
  isPending: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && !data.error) setUser(data);
        setIsPending(false);
      })
      .catch(() => setIsPending(false));
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data.user);
    window.location.href = "/perfil"; // Força recarregar os dados
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    await login(email, pass); // Loga automaticamente após o cadastro
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isPending, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};