-- Tabela de Histórico de Doações
CREATE TABLE donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  volume INTEGER,
  feedback TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendas do Transporte Parceiro
CREATE TABLE transport_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  departure_date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  available_seats INTEGER DEFAULT 15
);

-- Tabela de Reservas de Transporte
CREATE TABLE transport_bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  schedule_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, schedule_id)
);

-- Inserir algumas datas de transporte fictícias para testarmos
INSERT INTO transport_schedules (departure_date, departure_time) VALUES ('2026-04-15', '07:30');
INSERT INTO transport_schedules (departure_date, departure_time) VALUES ('2026-05-15', '07:30');
INSERT INTO transport_schedules (departure_date, departure_time) VALUES ('2026-06-15', '07:30');