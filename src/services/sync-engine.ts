import { Sync_ } from "@/types/sync";
import type { SQLiteDatabase } from "expo-sqlite";
import { supabase } from "./supabase";

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
    if (item.operation === "INSERT") {
      const cliente = JSON.parse(item.payload!);

      const { error } = await supabase.from("clientes").insert(cliente);

      if (error) {
        console.log("SYNC: erro ao inserir cliente", error);

        await db.runAsync(
          `
            UPDATE sync_queue
            SET
                attempts = attempts + 1,
                last_error = ?
            WHERE id = ?
        `,
          error.message,
          item.id,
        );

        return;
      }

      await db.runAsync(
        `
            DELETE FROM sync_queue
            WHERE id = ?
        `,

        item.id,
      );

      console.log("SYNC: cliente enviado com sucesso");
    }

    if (item.operation === "UPDATE") {
      const cliente = JSON.parse(item.payload!);

      const { id, ...userData } = cliente;

      const { error } = await supabase
        .from("clientes")
        .update(userData)
        .eq("id", id);

      if (error) {
        console.log("SYNC: erro ao atualizar cliente", error);

        await db.runAsync(
          `
        UPDATE sync_queue
        SET
          attempts = attempts + 1,
          last_error = ?
        WHERE id = ?
      `,
          error.message,
          item.id,
        );

        return;
      }

      await db.runAsync(
        `
      DELETE FROM sync_queue
      WHERE id = ?
    `,
        item.id,
      );

      console.log("SYNC: cliente atualizado com sucesso");
    }

    if (item.operation === "DELETE") {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", item.entity_id);

      if (error) {
        console.log("Sync: erro ao deletar cliente", error);

        await db.runAsync(
          `
            UPDATE sync_queue
            SET
              attempts = attempts + 1,
              last_error = ?
            WHERE id = ?
          `,
          error.message,
          item.id,
        );

        return;
      }

      await db.runAsync(
        `
          DELETE FROM sync_queue
          WHERE id = ?
        `,
        item.id,
      );

      console.log("Sync: cliente deletado com sucesso.");
    }
  }
}
