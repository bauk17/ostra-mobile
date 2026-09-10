import { supabase } from "@/services/supabase";
import type { Sync_ } from "@/types/sync";

export async function syncCliente(
  item: Sync_,
): Promise<{ success: true } | { success: false; error: string }> {
  if (item.operation === "INSERT") {
    const cliente = JSON.parse(item.payload!);

    const { error } = await supabase.from("clientes").insert(cliente);

    if (error) {
      console.log("SYNC: erro ao inserir cliente", error);

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("SYNC: cliente enviado com sucesso");

    return {
      success: true,
    };
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

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("SYNC: cliente atualizado com sucesso");

    return { success: true };
  }

  if (item.operation === "DELETE") {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", item.entity_id);

    if (error) {
      console.log("Sync: erro ao deletar cliente", error);

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("Sync: cliente deletado com sucesso.");

    return { success: true };
  }

  return { success: false, error: "" };
}
