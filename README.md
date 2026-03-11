```markdown
# 🩸 CarboSangue

**CarboSangue** é uma plataforma moderna e responsiva dedicada à gestão e incentivo da doação de sangue. O sistema conecta doadores, mantém o registro de histórico médico básico e organiza a logística de transporte, facilitando o deslocamento seguro de voluntários até os hemocentros.

## ✨ Funcionalidades Principais

- **Autenticação e Segurança:** Sistema de cadastro e login robusto utilizando JWT (JSON Web Tokens) armazenados em cookies `HttpOnly`, com senhas criptografadas nativamente via WebCrypto API.
- **Perfil do Doador:** Área exclusiva para o usuário gerenciar suas informações e visualizar seu tipo sanguíneo.
- **Histórico de Doações:** Registro cronológico de todas as doações realizadas, incluindo data, volume doado e feedback.
- **Logística de Transporte:** Sistema inteligente de agendamento que permite aos usuários reservarem assentos em viagens programadas para os centros de coleta.

## 🛠️ Tecnologias Utilizadas

O projeto adota uma arquitetura *Serverless* e *Edge Computing*, garantindo latência quase zero e alta escalabilidade.

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) para estilização
- Componentes UI modulares (Shadcn/UI based)

**Backend & Banco de Dados:**
- [Hono.js](https://hono.dev/): Framework web ultrarrápido rodando no Edge.
- [Cloudflare D1](https://developers.cloudflare.com/d1/): Banco de dados SQL relacional e serverless (construído sobre SQLite).
- [Cloudflare Pages](https://pages.cloudflare.com/): Hospedagem do frontend e funções de API integradas via `_worker.js`.

---

## 🚀 Como Executar o Projeto Localmente

Para rodar o CarboSangue na sua máquina, você precisará do [Node.js](https://nodejs.org/) instalado.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/leonardodalmeida/carbosangue.git](https://github.com/leonardodalmeida/carbosangue.git)
cd carbosangue

```

### 2. Instalar Dependências

```bash
npm install

```

### 3. Rodar o Ambiente de Desenvolvimento

O projeto utiliza o Wrangler (CLI da Cloudflare) para simular o ambiente de produção localmente e conectar-se ao banco de dados remoto da nuvem.

```bash
# Inicia o frontend (Vite) e o backend (Hono) simultaneamente
npx wrangler dev --remote

```

O site estará disponível em `http://127.0.0.1:8787`. Todas as alterações no código serão recarregadas automaticamente (Hot Module Replacement).

---

## ☁️ Deploy e Infraestrutura

O deploy deste projeto é totalmente automatizado via **Cloudflare Pages CI/CD**.

Sempre que um novo commit é enviado para a branch `main` do GitHub, a Cloudflare intercepta a mudança, executa o comando de build configurado (`npm run build`) e publica a nova versão globalmente em questão de segundos.

* **Frontend:** Construído em `dist/client`.
* **Backend:** Empacotado pelo ESBuild em um arquivo `_worker.js` interceptador para gerenciar as rotas `/api/*`.

---

## 🗄️ Gerenciamento do Banco de Dados

O banco de dados oficial pode ser gerenciado de duas formas:

1. **Visualmente:** Através do painel da Cloudflare (Workers & Pages > D1 > `carbosangue-db`).
2. **Via Terminal (Wrangler CLI):**
```bash
# Exemplo para consultar usuários direto do terminal
npx wrangler d1 execute carbosangue-db --remote --command="SELECT * FROM users;"

```