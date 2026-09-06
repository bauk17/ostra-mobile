import type { Cliente } from "@/types/cliente";
import type { SQLiteDatabase } from "expo-sqlite";

export async function criarCliente(db: SQLiteDatabase, cliente: Cliente) {
  await db.runAsync(
    `
            INSERT into clientes (
                id,
                nome,
                telefone,
                endereco,
                numero,
                bairro,
                created_at            
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
    cliente.id,
    cliente.nome,
    cliente.telefone,
    cliente.endereco,
    cliente.numero,
    cliente.bairro,
    cliente.created_at,
  );
}

export async function listarClientes(db: SQLiteDatabase): Promise<Cliente[]> {
  return await db.getAllAsync<Cliente>(
    `
            SELECT
                id,
                nome,
                telefone,
                endereco,
                numero,
                bairro,
                created_at
            FROM clientes
            ORDER BY nome ASC

        `,
  );
}

export async function buscarClientePorId(
  db: SQLiteDatabase,
  id: string,
): Promise<Cliente | null> {
  return await db.getFirstAsync<Cliente>(
    `
            SELECT
                id,
                nome,
                telefone,
                endereco,
                numero,
                bairro,
                created_at
            FROM clientes
            WHERE id = ?
        `,
    id,
  );
}

export async function atualizarCliente(
  db: SQLiteDatabase,
  cliente: Cliente,
): Promise<void> {
  await db.runAsync(
    `
      UPDATE clientes
      SET
        nome = ?,
        telefone = ?,
        endereco = ?,
        numero = ?,
        bairro = ?
      WHERE id = ?
    `,
    cliente.nome,
    cliente.telefone,
    cliente.endereco,
    cliente.numero,
    cliente.bairro,
    cliente.id,
  );
}
