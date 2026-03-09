import { useState } from "react";
import { Link } from "react-router";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  RefreshCw,
  Calendar,
  Info
} from "lucide-react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { Button } from "@/react-app/components/ui/button";

// Regras básicas de doação (ANVISA)
const donationRules = [
  { rule: "Ter entre 16 e 69 anos de idade", note: "Menores de 18 precisam de autorização do responsável" },
  { rule: "Pesar no mínimo 50 kg", note: "" },
  { rule: "Estar em boas condições de saúde", note: "" },
  { rule: "Estar descansado (dormido pelo menos 6 horas)", note: "" },
  { rule: "Estar alimentado, evitando alimentos gordurosos nas 4 horas antes", note: "" },
  { rule: "Apresentar documento de identidade com foto", note: "RG, CNH, Passaporte, etc." },
  { rule: "Não ter ingerido bebida alcoólica nas últimas 12 horas", note: "" },
  { rule: "Aguardar intervalo entre doações", note: "Homens: 60 dias | Mulheres: 90 dias" },
];

// Perguntas do quiz
const quizQuestions = [
  {
    id: 1,
    question: "Qual a sua idade?",
    type: "choice" as const,
    options: [
      { text: "Menos de 16 anos", result: "inapto_definitivo", reason: "Idade mínima para doação é 16 anos." },
      { text: "Entre 16 e 69 anos", result: "continuar" },
      { text: "70 anos ou mais", result: "inapto_definitivo", reason: "Idade máxima para doação é 69 anos." },
    ],
  },
  {
    id: 2,
    question: "Você pesa 50 kg ou mais?",
    type: "choice" as const,
    options: [
      { text: "Sim", result: "continuar" },
      { text: "Não", result: "inapto_definitivo", reason: "O peso mínimo para doação é 50 kg." },
    ],
  },
  {
    id: 3,
    question: "Você dormiu pelo menos 6 horas na última noite?",
    type: "choice" as const,
    options: [
      { text: "Sim", result: "continuar" },
      { text: "Não", result: "inapto_temporario", reason: "É necessário estar descansado para doar. Volte quando tiver dormido bem." },
    ],
  },
  {
    id: 4,
    question: "Você consumiu bebida alcoólica nas últimas 12 horas?",
    type: "choice" as const,
    options: [
      { text: "Não", result: "continuar" },
      { text: "Sim", result: "inapto_temporario", reason: "Aguarde 12 horas após consumo de álcool para doar." },
    ],
  },
  {
    id: 5,
    question: "Você fez tatuagem ou piercing nos últimos 6 meses?",
    type: "choice" as const,
    options: [
      { text: "Não", result: "continuar" },
      { text: "Sim", result: "inapto_temporario", reason: "Aguarde 6 meses após tatuagem ou piercing para doar." },
    ],
  },
  {
    id: 6,
    question: "Você teve gripe, resfriado ou febre nos últimos 7 dias?",
    type: "choice" as const,
    options: [
      { text: "Não", result: "continuar" },
      { text: "Sim", result: "inapto_temporario", reason: "Aguarde 7 dias após o fim dos sintomas para doar." },
    ],
  },
  {
    id: 7,
    question: "Você tomou alguma vacina nos últimos 7 dias?",
    type: "choice" as const,
    options: [
      { text: "Não", result: "continuar" },
      { text: "Sim", result: "inapto_temporario", reason: "Algumas vacinas exigem intervalo antes de doar. Consulte o hemocentro." },
    ],
  },
  {
    id: 8,
    question: "Você está grávida ou amamentando?",
    type: "choice" as const,
    options: [
      { text: "Não", result: "continuar" },
      { text: "Sim", result: "inapto_temporario", reason: "Gestantes não podem doar. Lactantes devem aguardar 12 meses após o parto." },
      { text: "Não se aplica", result: "continuar" },
    ],
  },
];

type QuizResult = "apto" | "inapto_temporario" | "inapto_definitivo" | null;

export default function TriagemPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<QuizResult>(null);
  const [resultReason, setResultReason] = useState("");

  const handleAnswer = (optionResult: string, reason?: string) => {
    if (optionResult === "inapto_definitivo") {
      setResult("inapto_definitivo");
      setResultReason(reason || "");
    } else if (optionResult === "inapto_temporario") {
      setResult("inapto_temporario");
      setResultReason(reason || "");
    } else if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResult("apto");
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setResult(null);
    setResultReason("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-50 via-white to-red-50/50 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Triagem para Doação
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Confira as regras básicas e faça um quiz rápido para verificar 
              se você está apto(a) a doar sangue.
            </p>
          </div>
        </section>

        {/* Rules Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Requisitos Básicos (ANVISA)
              </h2>
            </div>
            
            <div className="grid gap-4">
              {donationRules.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-transparent border border-green-100 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-medium">{item.rule}</p>
                    {item.note && (
                      <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-red-600 p-6 text-white text-center">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <h2 className="text-2xl font-bold">Quiz de Aptidão</h2>
                <p className="text-white/80 mt-2">
                  Responda algumas perguntas rápidas para verificar sua aptidão
                </p>
              </div>

              <div className="p-6 md:p-8">
                {!quizStarted && !result && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-8">
                      Este quiz é apenas uma pré-avaliação. A aptidão definitiva 
                      é determinada pelo profissional de saúde no momento da doação.
                    </p>
                    <Button 
                      onClick={() => setQuizStarted(true)}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg font-semibold"
                    >
                      Iniciar Quiz
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}

                {quizStarted && !result && (
                  <div>
                    {/* Progress */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
                        <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question */}
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(option.result, option.reason)}
                          className="w-full text-left p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-red-50 transition-all font-medium"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>

                    {currentQuestion > 0 && (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mt-6"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                      </button>
                    )}
                  </div>
                )}

                {result && (
                  <ResultCard 
                    result={result} 
                    reason={resultReason} 
                    onReset={resetQuiz} 
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ResultCard({ result, reason, onReset }: { 
  result: QuizResult; 
  reason: string;
  onReset: () => void;
}) {
  const configs = {
    apto: {
      icon: <CheckCircle2 className="w-16 h-16" />,
      title: "Você está APTO(A) a doar!",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      message: "Parabéns! Com base nas suas respostas, você pode ser um doador de sangue. Agende sua doação e salve vidas!",
    },
    inapto_temporario: {
      icon: <AlertCircle className="w-16 h-16" />,
      title: "Inapto(a) Temporariamente",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      message: reason || "Você está temporariamente impedido(a) de doar. Aguarde o período indicado e tente novamente.",
    },
    inapto_definitivo: {
      icon: <XCircle className="w-16 h-16" />,
      title: "Inapto(a) para Doação",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      message: reason || "Infelizmente você não atende aos requisitos para doação de sangue.",
    },
  };

  const config = result ? configs[result] : configs.apto;

  return (
    <div className={`text-center py-8 px-4 rounded-2xl ${config.bg} border ${config.border}`}>
      <div className={`${config.color} flex justify-center mb-4`}>
        {config.icon}
      </div>
      <h3 className={`text-2xl font-bold mb-4 ${config.color}`}>
        {config.title}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {config.message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {result === "apto" && (
          <Link
            to="/cadastro"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Cadastrar para Doar
          </Link>
        )}
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-6 py-3 rounded-full font-semibold border border-border hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refazer Quiz
        </button>
      </div>
    </div>
  );
}
