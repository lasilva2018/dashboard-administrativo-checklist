// Logo do Grupo Pensou
export const APP_LOGO = "/logo-pensou.png";

// Título da aplicação
export const APP_TITLE = "Dashboard Administrativo - Inspeções Prediais";

// Status possíveis das inspeções
export const STATUS = {
  PENDENTE: "Pendente Aprovação",
  APROVADA: "Aprovada",
  REPROVADA: "Reprovada",
} as const;

// Status dos itens do checklist
export const ITEM_STATUS = {
  OK: "OK",
  NOK: "NOK",
  NA: "NA",
} as const;

// Cores do Grupo Pensou (OKLCH format para Tailwind 4)
export const COLORS = {
  PRIMARY: "oklch(0.38 0.15 264)", // Azul royal escuro
  PRIMARY_LIGHT: "oklch(0.55 0.18 264)", // Azul claro
  PRIMARY_HOVER: "oklch(0.45 0.16 264)", // Azul médio
} as const;

// Itens por página na paginação
export const ITEMS_PER_PAGE = 50;

// Rotas da aplicação
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  INSPECOES: "/inspecoes",
  HISTORICO: "/historico",
} as const;
