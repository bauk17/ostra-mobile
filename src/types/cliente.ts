export type Cliente = {
  id: string;
  documento: string;
  nome: string;
  endereco: string;
  status: "Ativo" | "Pendente";
  pedidos: number;
  ultimoPedido: string;
  telefone: string;
  inadimplente?: boolean;
  recorrente?: boolean;
  valorPendente?: number;
};
