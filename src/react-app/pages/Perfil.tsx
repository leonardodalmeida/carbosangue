import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { 
  Loader2, User, Droplets, LogOut, Save, Heart, MapPin, CheckCircle2, Award, Calendar, Bus, Shield, Star
} from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { Button } from "@/react-app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PerfilPage() {
  const { user, isPending, logout } = useAuth();
  const navigate = useNavigate();
  const [, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados Gamificação & Histórico
  const [donations, setDonations] = useState<any[]>([]);
  const [newDonationDate, setNewDonationDate] = useState("");
  const [newDonationVolume, setNewDonationVolume] = useState("450");
  const [newDonationFeedback, setNewDonationFeedback] = useState("");

  // Estados Logística
  const [schedules, setSchedules] = useState<any[]>([]);
  const [bookedIds, setBookedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user && !isPending) navigate("/login");
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Carregar Perfil
      const resProfile = await fetch("/api/users/me");
      if (resProfile.ok) {
        const data = await resProfile.json();
        setProfile(data.profile);
        setName(data.profile?.name || "Doador");
        setSelectedBloodType(data.profile?.blood_type || "");
      }
      // Carregar Doações
      const resDonations = await fetch("/api/donations");
      if (resDonations.ok) {
        const data = await resDonations.json();
        setDonations(data.donations);
      }
      // Carregar Logística
      const resTransport = await fetch("/api/transport");
      if (resTransport.ok) {
        const data = await resTransport.json();
        setSchedules(data.schedules);
        setBookedIds(data.bookedIds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/users/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blood_type: selectedBloodType || null, name: name || null }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally { setIsSaving(false); }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/donations", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDonationDate, volume: parseInt(newDonationVolume), feedback: newDonationFeedback }),
    });
    setNewDonationDate(""); setNewDonationFeedback("");
    fetchData(); // Recarregar dados
  };

  const handleBookTransport = async (schedule_id: number) => {
    await fetch("/api/transport/book", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedule_id }),
    });
    fetchData(); // Atualiza vagas e botões
    alert("Lugar reservado com sucesso no transporte solidário!");
  };

  if (isPending || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!user) return null;

  // Lógica da Jornada do Herói COM SENSIBILIZAÇÃO
  const donationCount = donations.length;
  let heroLevel = "Iniciado";
  let heroIcon = <Star className="w-6 h-6 text-gray-400" />;
  let nextLevelGoal = 1;
  let progressText = "Sabia que a necessidade de cirurgias no SUS só cresce com o envelhecimento da população (IBGE)? A sua primeira doação é o primeiro passo para equilibrar esta balança!";

  if (donationCount >= 3) {
    heroLevel = "Herói da Carbonífera";
    heroIcon = <Award className="w-6 h-6 text-yellow-500" />;
    nextLevelGoal = donationCount;
    progressText = "É uma lenda! Faz parte da minoria de brasileiros que sustenta a esperança nos hospitais. Continue a salvar vidas.";
  } else if (donationCount >= 1) {
    heroLevel = "Guardião da Gota";
    heroIcon = <Shield className="w-6 h-6 text-blue-500" />;
    nextLevelGoal = 3;
    progressText = `Já superou os 38% de brasileiros que doam apenas uma vez por reposição (OPAS/OMS)! Faltam ${3 - donationCount} doações para se tornar num Herói da Carbonífera.`;
  }
  const progressPercent = Math.min((donationCount / nextLevelGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />
      
      <main className="pt-20 md:pt-24 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Banner do Utilizador */}
        <section className="bg-gradient-to-br from-red-50 via-white to-red-50/50 rounded-3xl p-8 mb-8 border border-border flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg shrink-0">
            {heroIcon}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground">{name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
              {selectedBloodType && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <Droplets className="w-4 h-4" /> Tipo {selectedBloodType}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {heroIcon} Nível: {heroLevel}
              </span>
            </div>
          </div>
          <Button onClick={logout} variant="outline" className="shrink-0 gap-2"><LogOut className="w-4 h-4"/> Sair</Button>
        </section>

        <Tabs defaultValue="gamificacao" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-muted rounded-2xl">
            <TabsTrigger value="gamificacao" className="rounded-xl">Jornada do Herói</TabsTrigger>
            <TabsTrigger value="logistica" className="rounded-xl">Logística & Mapa</TabsTrigger>
            <TabsTrigger value="perfil" className="rounded-xl">Meus Dados</TabsTrigger>
          </TabsList>

          {/* TAB 1: GAMIFICAÇÃO & HISTÓRICO */}
          <TabsContent value="gamificacao" className="space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-6 h-6 text-primary"/> O seu Progresso</h2>
              <p className="text-muted-foreground mb-2">{progressText}</p>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-6">
                <div className="bg-primary h-4 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-sm font-medium">Total de doações: {donationCount}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-primary"/> Registar Nova Doação</h3>
                <form onSubmit={handleAddDonation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data da Doação</label>
                    <input type="date" required value={newDonationDate} onChange={e=>setNewDonationDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Volume (ml)</label>
                    <input type="number" required value={newDonationVolume} onChange={e=>setNewDonationVolume(e.target.value)} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Como se sentiu? Ocorreu tudo bem?</label>
                    <textarea value={newDonationFeedback} onChange={e=>setNewDonationFeedback(e.target.value)} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20" placeholder="Feedback da experiência..."></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-white rounded-xl">Registar Doação</Button>
                </form>
              </div>

              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="font-bold mb-4">Histórico de Doações</h3>
                {donations.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">Ainda não registou nenhuma doação.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {donations.map((d: any) => (
                      <div key={d.id} className="p-3 border rounded-xl bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{new Date(d.date).toLocaleDateString('pt-BR')}</p>
                          <p className="text-xs text-muted-foreground">{d.volume} ml</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: LOGÍSTICA & MAPA */}
          <TabsContent value="logistica" className="space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-6 h-6 text-primary"/> Hemocentro de Referência</h2>
              <p className="text-muted-foreground mb-4">HEMORGS - Av. Bento Gonçalves, 3722 - Partenon, Porto Alegre - RS</p>
              <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden border">
                <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src="https://maps.google.com/maps?q=HEMORGS%20Bento%20Gon%C3%A7alves%203722&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bus className="w-6 h-6 text-primary"/> Agendamento de Transporte Solidário</h2>
              <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 text-sm">
                <strong>O nosso propósito:</strong> A queda de doações em todo o país mostra que as campanhas tradicionais não são suficientes (Datasus). Sabemos que a distância até Porto Alegre é um obstáculo para a Região Carbonífera. Por isso, encurtamos o caminho: reserve o seu lugar no transporte gratuito e faça parte da solução.
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {schedules.map((schedule: any) => {
                  const isBooked = bookedIds.includes(schedule.id);
                  const isFull = schedule.available_seats <= 0;
                  return (
                    <div key={schedule.id} className="border rounded-xl p-4 flex flex-col justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-3 rounded-lg"><Calendar className="w-6 h-6 text-primary" /></div>
                        <div>
                          <p className="font-bold">{new Date(schedule.departure_date).toLocaleDateString('pt-BR')}</p>
                          <p className="text-sm text-muted-foreground">Saída: {schedule.departure_time}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600 mb-4">
                        Vagas: {schedule.available_seats} / 15
                      </div>
                      {isBooked ? (
                        <div className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-center font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5"/> Vaga Reservada!
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleBookTransport(schedule.id)} 
                          disabled={isFull}
                          className="w-full bg-primary text-white rounded-lg"
                        >
                          {isFull ? "Lotação Esgotada" : "Agendar Minha Ida"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: PERFIL (Dados Antigos) */}
          <TabsContent value="perfil">
            <div className="bg-white rounded-2xl border p-6 shadow-sm max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-primary"/> Seus Dados Pessoais</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" value={user.email} disabled className="w-full px-4 py-3 border rounded-xl bg-muted text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Tipo Sanguíneo</label>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_TYPES.map((type) => (
                      <button key={type} onClick={() => setSelectedBloodType(type)} className={`px-4 py-3 rounded-xl font-semibold transition-all ${selectedBloodType === type ? "bg-primary text-white" : "bg-red-50 text-foreground hover:bg-red-100"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full bg-primary text-white py-6 rounded-xl font-semibold">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : saveSuccess ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  {saveSuccess ? "Salvo com sucesso!" : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>
      <Footer />
    </div>
  );
}