export type Sync_ = {
  id: number;
  entity: string;
  entity_id: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  payload: string | null;
  attempts: number;
};
