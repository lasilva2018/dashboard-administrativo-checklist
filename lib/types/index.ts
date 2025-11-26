// Tipos baseados na estrutura do Baserow

export interface ItemChecklist {
  id: number;
  item: string;
  status: "OK" | "NOK" | "NA";
  observacao?: string;
  foto?: string;
}

export interface Inspecao {
  id: number;
  data: string; // ISO date string
  zelador: string;
  condominio: string;
  status: "Pendente Aprovação" | "Aprovada" | "Reprovada";
  itens: ItemChecklist[];
  comentarioSindico?: string;
  aprovadoPor?: string;
  dataAprovacao?: string;
}

export interface DashboardStats {
  total: number;
  pendentes: number;
  aprovadas: number;
  reprovadas: number;
}

export type StatusFilter = "all" | "pendente" | "aprovada" | "reprovada";
