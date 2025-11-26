import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<string, { bg: string; label: string }> = {
    "Pendente Aprovação": {
      bg: "bg-yellow-100 text-yellow-800 border-yellow-300",
      label: "Pendente",
    },
    "Aprovado Admin": {
      bg: "bg-green-100 text-green-800 border-green-300",
      label: "Aprovado",
    },
    "Reprovado Admin": {
      bg: "bg-red-100 text-red-800 border-red-300",
      label: "Reprovado",
    },
    // Manter compatibilidade com status antigos
    Aprovada: {
      bg: "bg-green-100 text-green-800 border-green-300",
      label: "Aprovada",
    },
    Reprovada: {
      bg: "bg-red-100 text-red-800 border-red-300",
      label: "Reprovada",
    },
  };

  const variant = variants[status] || {
    bg: "bg-gray-100 text-gray-800 border-gray-300",
    label: status || "Desconhecido",
  };

  return (
    <Badge
      variant="outline"
      className={cn(variant.bg, "font-medium", className)}
    >
      {variant.label}
    </Badge>
  );
}
