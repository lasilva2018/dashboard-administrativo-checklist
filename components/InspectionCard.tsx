import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Inspecao } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Building2, User, Calendar, Eye } from "lucide-react";

interface InspectionCardProps {
  inspecao: Inspecao;
}

export default function InspectionCard({ inspecao }: InspectionCardProps) {
  const itemsNOK = inspecao.itens.filter((item) => item.status === "NOK").length;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Inspeção #{inspecao.id}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(inspecao.data)}</span>
            </div>
          </div>
          <StatusBadge status={inspecao.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{inspecao.condominio}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>Zelador: {inspecao.zelador}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Itens verificados: </span>
            <span className="font-medium">{inspecao.itens.length}</span>
            {itemsNOK > 0 && (
              <span className="ml-2 text-red-600">
                ({itemsNOK} não conforme{itemsNOK > 1 ? "s" : ""})
              </span>
            )}
          </div>
          <Link href={`/inspecoes/${inspecao.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
