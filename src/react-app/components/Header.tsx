import { Link } from "react-router";
import { Heart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/react-app/contexts/AuthContext";

const LOGO_URL = "https://019ccf63-8434-7503-8556-dfae31473ccf.mochausercontent.com/logo_carbosangue.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isPending } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={LOGO_URL} 
              alt="CarboSangue" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/triagem" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              Triagem
            </Link>
            
            {!isPending && user ? (
              <Link 
                to="/perfil" 
                className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden lg:inline">Meu Perfil</span>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-foreground/80 hover:text-primary font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/cadastro" 
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                  <Heart className="w-4 h-4" />
                  Seja um Doador
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/triagem" 
                className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Triagem
              </Link>
              
              {!isPending && user ? (
                <Link 
                  to="/perfil" 
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  Meu Perfil
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/cadastro" 
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Seja um Doador
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}