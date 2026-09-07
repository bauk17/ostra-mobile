import type { SQLiteDatabase } from "expo-sqlite";

type SyncOperation = "INSERT" | "UPDATE" | "DELETE";

type AddToSyncParams = {
  entity: string;
  entityId: string;
  operation: SyncOperation;
  payload?: unknown;
};

export async function addToQueue(
  db: SQLiteDatabase,
  params: AddToSyncParams,
): Promise<void> {
  await db.runAsync(
    `
            INSERT INTO sync_queue (
                entity,
                entity_id,
                operation,
                payload,
                created_at
            
            )
            VALUES(?, ?, ?, ?, ?)
        `,
    params.entity,
    params.entityId,
    params.operation,
    params.payload !== undefined ? JSON.stringify(params.payload) : null,
    new Date().toISOString(),
  );
}

export async function listQueue(db: SQLiteDatabase) {
  return await db.getAllAsync(
    `
            SELECT
                id,
                entity,
                entity_id,
                operation,
                payload,
                created_at,
                attempts,
                last_error
            FROM sync_queue
            ORDER BY id ASC

        `,
  );
}
