import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatar data para exibição
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// Formatar data e hora
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Obter cor do badge de status
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pendente':
    case 'pendente aprovação':
      return 'yellow';
    case 'aprovada':
      return 'green';
    case 'reprovada':
      return 'red';
    default:
      return 'gray';
  }
}

// Obter variante do badge de status
export function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toLowerCase()) {
    case 'pendente':
    case 'pendente aprovação':
      return 'outline';
    case 'aprovada':
      return 'default';
    case 'reprovada':
      return 'destructive';
    default:
      return 'secondary';
  }
}
