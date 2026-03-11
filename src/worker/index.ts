import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

type Bindings = {
  DB: D1Database; // Agora combina com o binding "DB" do wrangler.json
  ASSETS: any;
};

type Variables = {
  user: any;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const JWT_SECRET = "segredo-super-seguro-carbosangue-2026";
const COOKIE_NAME = "carbosangue_session";

const authMiddleware = async (c: any, next: any) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return c.json({ error: "Não autorizado" }, 401);
  try {
    const payload = await verify(token, JWT_SECRET);
    c.set("user", payload); // Voltamos para 'user' para bater com o resto das rotas
    await next();
  } catch (err) {
    return c.json({ error: "Token inválido" }, 401);
  }
};

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- ROTAS ---

app.post("/api/auth/register", async (c) => {
  const { name, email, password } = await c.req.json();
  const id = crypto.randomUUID();
  const hashed = await hashPassword(password);
  try {
    await c.env.DB.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").bind(id, email, hashed).run();
    await c.env.DB.prepare("INSERT INTO user_profiles (user_id, name) VALUES (?, ?)").bind(id, name).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Erro no cadastro" }, 400);
  }
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const hashed = await hashPassword(password);
  const { results } = await c.env.DB.prepare("SELECT id, email FROM users WHERE email = ? AND password_hash = ?").bind(email, hashed).all();
  const user = results[0];
  if (!user) return c.json({ error: "Invalido" }, 401);
  const token = await sign(user, JWT_SECRET);
  setCookie(c, COOKIE_NAME, token, { httpOnly: true, path: "/", sameSite: "Lax", secure: true, maxAge: 60 * 60 * 24 * 7 });
  // Mude para false temporariamente para testar no seu computador
  // setCookie(c, COOKIE_NAME, token, { httpOnly: true, path: "/", sameSite: "Lax", secure: false, maxAge: 60 * 60 * 24 * 7 });
  return c.json({ success: true, user });
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const { results } = await c.env.DB.prepare("SELECT * FROM user_profiles WHERE user_id = ?").bind(user.id).all();
  return c.json({ ...user, profile: results[0] || null });
});

app.put("/api/users/profile", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const { blood_type, name } = await c.req.json();
  await c.env.DB.prepare("UPDATE user_profiles SET blood_type = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?").bind(blood_type || null, name || null, user.id).run();
  return c.json({ success: true });
});

app.get("/api/donations", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const { results } = await c.env.DB.prepare("SELECT * FROM donations WHERE user_id = ? ORDER BY date DESC").bind(user.id).all();
  return c.json({ donations: results });
});

app.post("/api/donations", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const { date, volume, feedback } = await c.req.json();
  await c.env.DB.prepare("INSERT INTO donations (user_id, date, volume, feedback) VALUES (?, ?, ?, ?)").bind(user.id, date, volume, feedback).run();
  return c.json({ success: true });
});

app.get("/api/transport", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const schedules = await c.env.DB.prepare("SELECT * FROM transport_schedules WHERE departure_date >= date('now') ORDER BY departure_date ASC").all();
  const bookings = await c.env.DB.prepare("SELECT schedule_id FROM transport_bookings WHERE user_id = ?").bind(user.id).all();
  const bookedIds = (bookings.results as any[]).map(b => b.schedule_id);
  return c.json({ schedules: schedules.results, bookedIds });
});

app.post("/api/transport/book", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const { schedule_id } = await c.req.json();
  try {
    await c.env.DB.prepare("INSERT INTO transport_bookings (user_id, schedule_id) VALUES (?, ?)").bind(user.id, schedule_id).run();
    await c.env.DB.prepare("UPDATE transport_schedules SET available_seats = available_seats - 1 WHERE id = ?").bind(schedule_id).run();
    return c.json({ success: true });
  } catch (e) { return c.json({ error: "Erro" }, 400); }
});

app.get('*', async (c) => {
  // Qualquer rota que não seja da API, devolve os arquivos estáticos do React
  return await c.env.ASSETS.fetch(c.req.raw);
});

export default app;