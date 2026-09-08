import { syncCliente } from "@/sync/clientes-sync";
import { Sync_ } from "@/types/sync";
import type { SQLiteDatabase } from "expo-sqlite";
import { markSyncError, removeFromQueue } from "./sync-queue";

export async function syncQueue(db: SQLiteDatabase): Promise<void> {
  const item = await db.getFirstAsync<Sync_>(
    `
      SELECT
        id,
        entity,
        entity_id,
        operation,
        payload,
        attempts
      FROM sync_queue
      ORDER BY id ASC
      LIMIT 1
    `,
  );

  if (!item) {
    console.log("SYNC: Fila vazia!");
    return;
  }

  console.log("Sync: Processando", item);

  if (item.entity === "clientes") {
    const success = await syncCliente(item);

    if (success) {
      await removeFromQueue(db, item.id);
    } else {
      await markSyncError(db, item.id, "Erro ao sincronizar cliente");
    }
  }
}
