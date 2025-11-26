import { Inspecao, ItemChecklist } from "../types";

// Itens padrão do checklist baseados na estrutura do Baserow
const checklistItems: string[] = [
  "Limpeza das áreas comuns",
  "Estado das escadas",
  "Iluminação dos corredores",
  "Funcionamento dos elevadores",
  "Portaria e controle de acesso",
  "Jardins e áreas verdes",
  "Piscina e área de lazer",
  "Quadra esportiva",
  "Salão de festas",
  "Garagem e estacionamento",
  "Sistema de segurança",
  "Portões e fechaduras",
];

const zeladores = [
  "João Silva",
  "Maria Santos",
  "Pedro Oliveira",
  "Ana Costa",
  "Carlos Souza",
];

const condominios = [
  "Edifício Solar das Flores",
  "Residencial Boa Vista",
  "Condomínio Jardim Europa",
  "Edifício Morada do Sol",
  "Residencial Park Avenue",
];

function generateRandomItems(): ItemChecklist[] {
  const numItems = Math.floor(Math.random() * 5) + 8; // 8-12 itens
  const items: ItemChecklist[] = [];
  
  for (let i = 0; i < numItems; i++) {
    const statuses: ("OK" | "NOK" | "NA")[] = ["OK", "NOK", "NA"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    items.push({
      id: i + 1,
      item: checklistItems[i % checklistItems.length],
      status,
      observacao: status === "NOK" ? "Necessita reparo" : undefined,
      foto: status === "NOK" ? `/fotos/inspecao-${i}.jpg` : undefined,
    });
  }
  
  return items;
}

function generateMockInspecoes(): Inspecao[] {
  const inspecoes: Inspecao[] = [];
  const statuses: ("Pendente Aprovação" | "Aprovada" | "Reprovada")[] = [
    "Pendente Aprovação",
    "Aprovada",
    "Reprovada",
  ];
  
  for (let i = 1; i <= 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const zelador = zeladores[Math.floor(Math.random() * zeladores.length)];
    const condominio = condominios[Math.floor(Math.random() * condominios.length)];
    
    const inspecao: Inspecao = {
      id: i,
      data: date.toISOString(),
      zelador,
      condominio,
      status,
      itens: generateRandomItems(),
    };
    
    // Se aprovada ou reprovada, adicionar dados de aprovação
    if (status !== "Pendente Aprovação") {
      inspecao.aprovadoPor = "Lucas Silva";
      const approvalDate = new Date(date);
      approvalDate.setHours(approvalDate.getHours() + Math.floor(Math.random() * 48));
      inspecao.dataAprovacao = approvalDate.toISOString();
      
      if (status === "Reprovada") {
        inspecao.comentarioSindico = "Itens não conformes identificados. Favor refazer inspeção.";
      }
    }
    
    inspecoes.push(inspecao);
  }
  
  // Ordenar por data (mais recentes primeiro)
  return inspecoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export const mockInspecoes = generateMockInspecoes();
