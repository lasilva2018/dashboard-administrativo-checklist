export interface ChecklistItem {
  id: number;
  item: string;
  status: "OK" | "NOK" | "NA";
  observacao?: string;
  foto?: string;
}

// Alias para compatibilidade com componentes antigos
export type ItemChecklist = ChecklistItem;

export interface Inspecao {
  id: number;
  data: string;
  condominio: string;
  zelador: string;
  status: "Pendente Aprovação" | "Aprovada" | "Reprovada" | "Aprovado Admin" | "Reprovado Admin";
  itens: ChecklistItem[];
  aprovadoPor?: string;
  dataAprovacao?: string;
  comentarioSindico?: string;
}

export type StatusFilter = "all" | "pendente" | "aprovada" | "reprovada";

export interface DashboardStats {
  total: number;
  pendentes: number;
  aprovadas: number;
  reprovadas: number;
}
