import { Link } from "react-router";
import { Heart, Users, Building2, Droplets, CheckCircle2, ArrowRight, MapPin, Clock, Phone, TrendingDown, AlertCircle, Globe } from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50/50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Droplets className="w-4 h-4" />
                Região Carbonífera - RS
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                Doe sangue,
                <span className="block text-primary">salve vidas</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Uma única doação pode salvar até <strong className="text-foreground">4 vidas</strong>. 
                Junte-se a nós nesta corrente de solidariedade e faça a diferença 
                na sua comunidade.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/cadastro"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-105"
                >
                  <Heart className="w-5 h-5" />
                  Quero Doar
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/triagem"
                  className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 rounded-full font-semibold text-lg border-2 border-border hover:border-primary hover:text-primary transition-all"
                >
                  Verificar Aptidão
                </Link>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-primary/10 transform -rotate-1">
                <div className="grid grid-cols-2 gap-6">
                  <StatCard icon={<Droplets className="w-6 h-6" />} value="450ml" label="por doação" />
                  <StatCard icon={<Users className="w-6 h-6" />} value="4 vidas" label="salvas" />
                  <StatCard icon={<Clock className="w-6 h-6" />} value="~1 hora" label="do seu tempo" />
                  <StatCard icon={<Heart className="w-6 h-6" />} value="60 dias" label="para doar novamente" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVA SECÇÃO: O Desafio (Dados e Sensibilização) */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que precisamos de você agora?</h2>
            <div className="w-20 h-1 bg-white/30 mx-auto rounded-full mb-6" />
            <p className="text-lg text-red-100">
              O Brasil enfrenta um desafio silencioso. A procura por sangue aumenta, mas o número de doadores não acompanha. Veja os dados:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <DataCard 
              icon={<TrendingDown className="w-10 h-10" />}
              title="A Conta não Fecha"
              description="Entre 2010 e 2022, as coletas de sangue no SUS caíram 6,4%, enquanto a população cresceu e envelheceu, necessitando de mais cirurgias."
              source="Fonte: Datasus e IBGE"
            />
            <DataCard 
              icon={<AlertCircle className="w-10 h-10" />}
              title="Doadores de Ocasião"
              description="Hoje, cerca de 38% dos doadores doam apenas para ajudar um conhecido e nunca mais voltam. Precisamos de doadores regulares!"
              source="Fonte: OPAS/OMS e HEMOPROD"
            />
            <DataCard 
              icon={<Globe className="w-10 h-10" />}
              title="A Nossa Meta"
              description="O Brasil regista apenas 15 doações por 1.000 habitantes. Países europeus chegam a 50. O CarboSangue nasceu para mudar esta realidade!"
              source="Fonte: Relatório OPAS/OMS"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Sobre o Projeto</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              O <strong className="text-foreground">CarboSangue</strong> é uma iniciativa 
              desenvolvida por estudantes do Instituto Federal Sul-rio-grandense (IFSul) 
              Campus Charqueadas, com o objetivo de consciencializar e captar dadores de sangue 
              na Região Carbonífera do Rio Grande do Sul.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <AboutCard icon={<Building2 className="w-8 h-8" />} title="IFSul Charqueadas" description="Projeto educacional que une tecnologia e responsabilidade social, desenvolvido por alunos comprometidos com a comunidade." />
            <AboutCard icon={<Heart className="w-8 h-8" />} title="Parceria HEMORGS" description="Trabalhamos em conjunto com o Hemocentro do Estado do RS, localizado na Av. Bento Gonçalves, 3722 - Porto Alegre." />
            <AboutCard icon={<MapPin className="w-8 h-8" />} title="Hospital São Jerônimo" description="Apoio local do Hospital de São Jerônimo, fortalecendo a rede de solidariedade na região." />
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que doar sangue?
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReasonCard 
              title="Salva vidas"
              description="Uma doação pode ajudar até 4 pessoas em cirurgias, tratamentos e emergências."
            />
            <ReasonCard 
              title="É seguro"
              description="Todo material utilizado é descartável e estéril. Não há risco para o doador."
            />
            <ReasonCard 
              title="É rápido"
              description="O processo completo leva cerca de 1 hora, incluindo triagem e lanche."
            />
            <ReasonCard 
              title="Faz bem"
              description="Além de ajudar o próximo, doar sangue estimula a renovação celular."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-white/20 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Faça parte dessa corrente de solidariedade
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cadastre-se agora e descubra como você pode ajudar a salvar vidas 
            na sua comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/cadastro"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Cadastrar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              Já tenho cadastro
            </Link>
          </div>
        </div>
      </section>

      {/* Contact/Locations */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Onde doar?
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-lg text-muted-foreground">
              Confira os locais parceiros onde você pode fazer sua doação
            </p>
          </div>
          
          <div className="flex justify-center max-w-4xl mx-auto w-full">
            <div className="w-full max-w-md">
              <LocationCard 
                name="HEMORGS - Porto Alegre"
                address="Av. Bento Gonçalves, 3722"
                city="Porto Alegre - RS"
                phone="(51) 3336-6000"
                hours="Seg a Sex: 8h às 17h | Sáb: 8h às 12h"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Componente para a Nova Secção de Dados
function DataCard({ icon, title, description, source }: { icon: React.ReactNode; title: string; description: string; source: string }) {
  return (
    <div className="bg-red-700/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center flex flex-col items-center">
      <div className="text-red-100 mb-6 bg-red-600/50 p-4 rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-red-100 leading-relaxed mb-6 flex-grow">{description}</p>
      <div className="text-xs text-red-200/60 uppercase tracking-wider font-semibold">
        {source}
      </div>
    </div>
  );
}

// Restantes componentes utilitários (StatCard, AboutCard, ReasonCard, LocationCard) mantêm-se iguais
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-red-50 rounded-2xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-3">{icon}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function AboutCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-b from-white to-red-50/50 border border-border rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-primary/5 transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ReasonCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary/5 border border-red-100">
      <div className="flex items-center gap-3 mb-3">
        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function LocationCard({ name, address, city, phone, hours }: { 
  name: string; 
  address: string; 
  city: string; 
  phone: string;
  hours: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-foreground mb-4">{name}</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3 text-muted-foreground">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p>{address}</p>
            <p>{city}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
          <span>{hours}</span>
        </div>
      </div>
    </div>
  );
}
