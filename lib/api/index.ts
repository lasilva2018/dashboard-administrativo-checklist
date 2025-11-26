import { Inspecao, StatusFilter, DashboardStats, ChecklistItem } from "../types";

/**
 * API Client - Consome APIs proxy do Next.js que se conectam ao Baserow
 * Token do Baserow nunca é exposto ao frontend
 */

// Mapear campos do Baserow para o formato do frontend
function mapBaserowToInspecao(row: any): Inspecao {
  return {
    id: row.id,
    data: row.data_inspecao || new Date().toISOString(),
    condominio: row.condominio || "Sem nome",
    zelador: row.zelador || "Não informado",
    status: row.status?.value || row.status || "Pendente Aprovação",
    itens: [], // Será carregado separadamente
    aprovadoPor: row.aprovado_por || undefined,
    dataAprovacao: row.data_aprovacao || undefined,
    comentarioSindico: row.observacoes || undefined,
  };
}

function mapBaserowToChecklistItem(row: any): ChecklistItem {
  return {
    id: row.id,
    item: row.item_verificado || "Item sem nome",
    status: row.em_ordem?.value || "NA",
    observacao: row.problemas || row.providencias || undefined,
    foto: row.foto_item?.[0]?.url || row.link_evidencia || undefined,
  };
}

export async function getInspecoes(filter: StatusFilter = "all"): Promise<Inspecao[]> {
  try {
    let url = "/api/inspecoes";
    
    if (filter !== "all") {
      const statusMap: Record<StatusFilter, string> = {
        all: "",
        pendente: "Pendente Aprovação",
        aprovada: "Aprovada",
        reprovada: "Reprovada",
      };
      url += `?status=${encodeURIComponent(statusMap[filter])}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro ao buscar inspeções: ${res.status}`);
    
    const data = await res.json();
    return (data.results || []).map(mapBaserowToInspecao);
  } catch (error) {
    console.error("Erro em getInspecoes:", error);
    return [];
  }
}

export async function getInspecao(id: number): Promise<Inspecao | null> {
  try {
    // Buscar dados da inspeção
    const resInspecao = await fetch(`/api/inspecoes/${id}`);
    if (!resInspecao.ok) {
      if (resInspecao.status === 404) return null;
      throw new Error(`Erro ao buscar inspeção: ${resInspecao.status}`);
    }
    
    const inspecaoData = await resInspecao.json();
    const inspecao = mapBaserowToInspecao(inspecaoData);

    // Buscar itens do checklist
    const resItens = await fetch(`/api/inspecoes/${id}/itens`);
    if (resItens.ok) {
      const itensData = await resItens.json();
      inspecao.itens = (itensData.results || []).map(mapBaserowToChecklistItem);
    }

    return inspecao;
  } catch (error) {
    console.error("Erro em getInspecao:", error);
    return null;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const inspecoes = await getInspecoes("all");
    
    return {
      total: inspecoes.length,
      pendentes: inspecoes.filter((i) => i.status === "Pendente Aprovação").length,
      aprovadas: inspecoes.filter((i) => i.status === "Aprovado Admin" || i.status === "Aprovada").length,
      reprovadas: inspecoes.filter((i) => i.status === "Reprovado Admin" || i.status === "Reprovada").length,
    };
  } catch (error) {
    console.error("Erro em getDashboardStats:", error);
    return { total: 0, pendentes: 0, aprovadas: 0, reprovadas: 0 };
  }
}

export async function aprovarInspecao(id: number, comentario?: string, aprovadoPor?: string): Promise<Inspecao> {
  try {
    const res = await fetch(`/api/inspecoes/${id}/aprovar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentario, aprovadoPor }),
    });

    if (!res.ok) throw new Error(`Erro ao aprovar inspeção: ${res.status}`);
    
    const data = await res.json();
    
    // Recarregar inspeção atualizada
    const inspecao = await getInspecao(id);
    if (!inspecao) throw new Error("Inspeção não encontrada após aprovação");
    
    return inspecao;
  } catch (error) {
    console.error("Erro em aprovarInspecao:", error);
    throw error;
  }
}

export async function reprovarInspecao(id: number, comentario: string, aprovadoPor?: string): Promise<Inspecao> {
  try {
    const res = await fetch(`/api/inspecoes/${id}/reprovar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentario, aprovadoPor }),
    });

    if (!res.ok) throw new Error(`Erro ao reprovar inspeção: ${res.status}`);
    
    const data = await res.json();
    
    // Recarregar inspeção atualizada
    const inspecao = await getInspecao(id);
    if (!inspecao) throw new Error("Inspeção não encontrada após reprovação");
    
    return inspecao;
  } catch (error) {
    console.error("Erro em reprovarInspecao:", error);
    throw error;
  }
}
