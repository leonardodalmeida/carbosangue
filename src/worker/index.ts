import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

// Definição de Tipos para o Banco e Variáveis
type Bindings = {
  DB: D1Database;
};

type UserPayload = {
  id: string;
  email: string;
};

type Variables = {
  user: UserPayload;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const JWT_SECRET = "segredo-super-seguro-carbosangue-2026";
const COOKIE_NAME = "carbosangue_session";

// Middleware tipado
const authMiddleware = async (c: any, next: any) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return c.json({ error: "Não autorizado" }, 401);
  try {
    const payload = await verify(token, JWT_SECRET) as UserPayload;
    c.set("user", payload);
    await next();
  } catch (err) {
    return c.json({ error: "Token inválido" }, 401);
  }
};

// Funções Auxiliares
async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- ROTAS DE AUTENTICAÇÃO ---

app.post("/api/auth/register", async (c) => {
  const { name, email, password } = await c.req.json();
  if (!email || !password || !name) return c.json({ error: "Campos obrigatórios" }, 400);

  const id = crypto.randomUUID();
  const hashed = await hashPassword(password);

  try {
    await c.env.DB.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").bind(id, email, hashed).run();
    await c.env.DB.prepare("INSERT INTO user_profiles (user_id, name) VALUES (?, ?)").bind(id, name).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "E-mail já cadastrado." }, 400);
  }
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const hashed = await hashPassword(password);

  const user = await c.env.DB.prepare("SELECT id, email FROM users WHERE email = ? AND password_hash = ?")
    .bind(email, hashed).first<UserPayload>();

  if (!user) return c.json({ error: "Credenciais inválidas." }, 401);

  const token = await sign(user, JWT_SECRET);
  setCookie(c, COOKIE_NAME, token, { httpOnly: true, path: "/", sameSite: "Lax", secure: true, maxAge: 60 * 60 * 24 * 7 });
  return c.json({ success: true, user });
});

app.post("/api/auth/logout", async (c) => {
  setCookie(c, COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return c.json({ success: true });
});

// --- ROTAS DE PERFIL ---

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const profile = await c.env.DB.prepare("SELECT * FROM user_profiles WHERE user_id = ?").bind(user.id).first();
  return c.json({ ...user, profile });
});

app.put("/api/users/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  const { blood_type, name } = await c.req.json();
  await c.env.DB.prepare("UPDATE user_profiles SET blood_type = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?")
    .bind(blood_type || null, name || null, user.id).run();
  return c.json({ success: true });
});

// --- DOAÇÕES ---

app.get("/api/donations", authMiddleware, async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare("SELECT * FROM donations WHERE user_id = ? ORDER BY date DESC").bind(user.id).all();
  return c.json({ donations: results });
});

app.post("/api/donations", authMiddleware, async (c) => {
  const user = c.get("user");
  const { date, volume, feedback } = await c.req.json();
  await c.env.DB.prepare("INSERT INTO donations (user_id, date, volume, feedback) VALUES (?, ?, ?, ?)").bind(user.id, date, volume, feedback).run();
  return c.json({ success: true });
});

// --- TRANSPORTE ---

app.get("/api/transport", authMiddleware, async (c) => {
  const user = c.get("user");
  const schedules = await c.env.DB.prepare("SELECT * FROM transport_schedules WHERE departure_date >= date('now') ORDER BY departure_date ASC").all();
  const bookings = await c.env.DB.prepare("SELECT schedule_id FROM transport_bookings WHERE user_id = ?").bind(user.id).all();
  const bookedIds = bookings.results.map((b: any) => b.schedule_id);
  return c.json({ schedules: schedules.results, bookedIds });
});

app.post("/api/transport/book", authMiddleware, async (c) => {
  const user = c.get("user");
  const { schedule_id } = await c.req.json();
  try {
    await c.env.DB.prepare("INSERT INTO transport_bookings (user_id, schedule_id) VALUES (?, ?)").bind(user.id, schedule_id).run();
    await c.env.DB.prepare("UPDATE transport_schedules SET available_seats = available_seats - 1 WHERE id = ?").bind(schedule_id).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Erro na reserva." }, 400);
  }
});

export default app;