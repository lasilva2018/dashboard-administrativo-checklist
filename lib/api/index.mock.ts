import { Inspecao, DashboardStats, StatusFilter } from "../types";
import { mockInspecoes } from "./mockData";

// Simular delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getInspecoes(filter: StatusFilter = "all"): Promise<Inspecao[]> {
  await delay(300); // Simular latência
  
  if (filter === "all") {
    return mockInspecoes;
  }
  
  const statusMap: Record<StatusFilter, string> = {
    all: "",
    pendente: "Pendente Aprovação",
    aprovada: "Aprovada",
    reprovada: "Reprovada",
  };
  
  return mockInspecoes.filter((insp) => insp.status === statusMap[filter]);
}

export async function getInspecao(id: number): Promise<Inspecao | null> {
  await delay(200);
  return mockInspecoes.find((insp) => insp.id === id) || null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(150);
  
  return {
    total: mockInspecoes.length,
    pendentes: mockInspecoes.filter((i) => i.status === "Pendente Aprovação").length,
    aprovadas: mockInspecoes.filter((i) => i.status === "Aprovada").length,
    reprovadas: mockInspecoes.filter((i) => i.status === "Reprovada").length,
  };
}

export async function aprovarInspecao(id: number, comentario?: string): Promise<Inspecao> {
  await delay(500);
  
  const inspecao = mockInspecoes.find((i) => i.id === id);
  if (!inspecao) {
    throw new Error("Inspeção não encontrada");
  }
  
  inspecao.status = "Aprovada";
  inspecao.aprovadoPor = "Lucas Silva";
  inspecao.dataAprovacao = new Date().toISOString();
  if (comentario) {
    inspecao.comentarioSindico = comentario;
  }
  
  return inspecao;
}

export async function reprovarInspecao(id: number, comentario: string): Promise<Inspecao> {
  await delay(500);
  
  const inspecao = mockInspecoes.find((i) => i.id === id);
  if (!inspecao) {
    throw new Error("Inspeção não encontrada");
  }
  
  inspecao.status = "Reprovada";
  inspecao.aprovadoPor = "Lucas Silva";
  inspecao.dataAprovacao = new Date().toISOString();
  inspecao.comentarioSindico = comentario;
  
  return inspecao;
}
