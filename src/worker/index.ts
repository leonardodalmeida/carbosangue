import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

// Definimos os tipos para o TypeScript não reclamar
type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();
const JWT_SECRET = "segredo-super-seguro-carbosangue-2026"; // Chave para assinar o login
const COOKIE_NAME = "carbosangue_session";

// Middleware para proteger as rotas logadas
const authMiddleware = async (c: any, next: any) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return c.json({ error: "Não autorizado" }, 401);
  try {
    const payload = await verify(token, JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (err) {
    return c.json({ error: "Token inválido" }, 401);
  }
};

// Função para criptografar a senha (WebCrypto nativo)
async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ------------------------------------------
// ROTAS DE AUTENTICAÇÃO MANUAIS
// ------------------------------------------

// Cadastro
app.post("/api/auth/register", async (c) => {
  const body = await c.req.json();
  const { name, email, password } = body;
  
  if (!email || !password || !name) {
    return c.json({ error: "Preencha todos os campos" }, 400);
  }

  const id = crypto.randomUUID();
  const hashed = await hashPassword(password);

  try {
    // 1. Salva na tabela de senhas
    await c.env.DB.prepare(
      "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)"
    ).bind(id, email, hashed).run();

    // 2. Cria o perfil do usuário
    await c.env.DB.prepare(
      "INSERT INTO user_profiles (user_id, name) VALUES (?, ?)"
    ).bind(id, name).run();

    return c.json({ success: true }, 200);
  } catch (e) {
    return c.json({ error: "E-mail já cadastrado." }, 400);
  }
});

// Login
app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const hashed = await hashPassword(password);

  const { results } = await c.env.DB.prepare(
    "SELECT id, email FROM users WHERE email = ? AND password_hash = ?"
  ).bind(email, hashed).all();

  const user = results[0];
  if (!user) {
    return c.json({ error: "E-mail ou senha inválidos." }, 401);
  }

  // Gera o token de sessão JWT
  const token = await sign({ id: user.id, email: user.email }, JWT_SECRET);
  
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: false, // false para rodar localmente no localhost
    maxAge: 60 * 60 * 24 * 7 // 7 dias logado
  });

  return c.json({ success: true, user }, 200);
});

// Logout
app.post("/api/auth/logout", async (c) => {
  setCookie(c, COOKIE_NAME, "", {
    httpOnly: true, path: "/", maxAge: 0
  });
  return c.json({ success: true }, 200);
});

// ------------------------------------------
// ROTAS DO PERFIL
// ------------------------------------------

// Puxar os dados do usuário atual
app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user.id).all();

  return c.json({ ...user, profile: results[0] || null });
});

// Atualizar nome e tipo sanguíneo
app.put("/api/users/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  const { blood_type, name } = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE user_profiles SET blood_type = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
  ).bind(blood_type || null, name || null, user.id).run();

  return c.json({ success: true });
});

// ------------------------------------------
// ROTAS DE DOAÇÕES E GAMIFICAÇÃO
// ------------------------------------------

// Listar histórico de doações do utilizador
app.get("/api/donations", authMiddleware, async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM donations WHERE user_id = ? ORDER BY date DESC"
  ).bind(user.id).all();
  return c.json({ donations: results }, 200);
});

// Registar nova doação
app.post("/api/donations", authMiddleware, async (c) => {
  const user = c.get("user");
  const { date, volume, feedback } = await c.req.json();
  
  await c.env.DB.prepare(
    "INSERT INTO donations (user_id, date, volume, feedback) VALUES (?, ?, ?, ?)"
  ).bind(user.id, date, volume, feedback).run();
  
  return c.json({ success: true }, 200);
});

// ------------------------------------------
// ROTAS DE LOGÍSTICA E TRANSPORTE
// ------------------------------------------

// Listar viagens disponíveis e as reservas do utilizador
app.get("/api/transport", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const schedules = await c.env.DB.prepare(
    "SELECT * FROM transport_schedules WHERE departure_date >= date('now') ORDER BY departure_date ASC"
  ).all();

  const userBookings = await c.env.DB.prepare(
    "SELECT schedule_id FROM transport_bookings WHERE user_id = ?"
  ).bind(user.id).all();

  const bookedIds = userBookings.results.map((b: any) => b.schedule_id);

  return c.json({ 
    schedules: schedules.results,
    bookedIds 
  }, 200);
});

// Agendar lugar no transporte
app.post("/api/transport/book", authMiddleware, async (c) => {
  const user = c.get("user");
  const { schedule_id } = await c.req.json();

  try {
    await c.env.DB.prepare(
      "INSERT INTO transport_bookings (user_id, schedule_id) VALUES (?, ?)"
    ).bind(user.id, schedule_id).run();

    await c.env.DB.prepare(
      "UPDATE transport_schedules SET available_seats = available_seats - 1 WHERE id = ?"
    ).bind(schedule_id).run();

    return c.json({ success: true }, 200);
  } catch (e) {
    return c.json({ error: "Já tem reserva para esta data ou ocorreu um erro." }, 400);
  }
});

export default app;