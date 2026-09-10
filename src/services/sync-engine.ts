import { syncCliente } from "@/sync/clientes-sync";
import { Sync_ } from "@/types/sync";
import type { SQLiteDatabase } from "expo-sqlite";
import { markSyncError, removeFromQueue } from "./sync-queue";

let isSyncing = false;

export async function syncQueue(db: SQLiteDatabase): Promise<void> {
  if (isSyncing) {
    console.log("SYNC: já está sincronizando");
    return;
  }

  isSyncing = true;

  try {
    while (true) {
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
        break;
      }

      console.log("Sync: Processando", item);

      if (item.entity === "clientes") {
        const result = await syncCliente(item);

        if (result.success) {
          await removeFromQueue(db, item.id);
          continue;
        }

        await markSyncError(db, item.id, result.error);

        console.log("SYNC: interrompendo processamento da fila");
        break;
      }
    }
  } catch (error) {
    console.error("SYNC: erro inesperado", error);
  } finally {
    isSyncing = false;
  }
}
