import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      telefone TEXT,
      endereco TEXT,
      numero TEXT,
      bairro TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT,
      created_at TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_state (
      entity TEXT PRIMARY KEY NOT NULL,
      last_synced_at TEXT
    );
  `);

  const colunasSyncQueue = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(sync_queue);",
  );

  const nomesColunasSyncQueue = new Set(
    colunasSyncQueue.map((coluna) => coluna.name),
  );

  if (!nomesColunasSyncQueue.has("next_retry_at")) {
    await db.execAsync("ALTER TABLE sync_queue ADD COLUMN next_retry_at TEXT;");
  }

  const colunasClientes = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(clientes);",
  );

  const nomesColunasClientes = new Set(
    colunasClientes.map((coluna) => coluna.name),
  );

  if (!nomesColunasClientes.has("numero")) {
    await db.execAsync("ALTER TABLE clientes ADD COLUMN numero TEXT;");
  }

  if (!nomesColunasClientes.has("bairro")) {
    await db.execAsync("ALTER TABLE clientes ADD COLUMN bairro TEXT;");
  }
}
