import { Heart, MapPin, Mail, Phone, Database } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src="/logo_ifsul_charqueadas.png" alt="IFSul Charqueadas" className="h-14 w-auto" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Projeto desenvolvido por estudantes do IFSul Campus Charqueadas 
              para incentivar a doação de sangue na Região Carbonífera do RS.
            </p>
          </div>

          {/* HEMORGS */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">HEMORGS - Porto Alegre</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <span>Av. Bento Gonçalves, 3722<br />Porto Alegre - RS</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>(51) 3336-6000</span>
              </div>
            </div>
          </div>

          {/* Hospital São Jerônimo */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Hospital São Jerônimo</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <span>São Jerônimo - RS</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>contato@carbosangue.com.br</span>
              </div>
            </div>
          </div>

          {/* NOVA SECÇÃO: Fontes Oficiais */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" /> Fontes Oficiais
            </h4>
            <p className="text-gray-400 text-xs mb-3">
              Os dados de consciencialização utilizados neste projeto são fundamentados em:
            </p>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> IBGE (Censos 2010 e 2022)</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> OPAS/OMS (Relatório de Acesso a Sangue)</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Datasus e HEMOPROD</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CarboSangue. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> por estudantes do IFSul Charqueadas
          </p>
        </div>
      </div>
    </footer>
  );
}