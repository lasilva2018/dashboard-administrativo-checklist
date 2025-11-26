import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemChecklist } from "@/lib/types";
import { CheckCircle2, XCircle, MinusCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItemsProps {
  items: ItemChecklist[];
  onPhotoClick?: (photoUrl: string) => void;
}

export default function ChecklistItems({ items, onPhotoClick }: ChecklistItemsProps) {
  const getStatusIcon = (status: "OK" | "NOK" | "NA") => {
    switch (status) {
      case "OK":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "NOK":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "NA":
        return <MinusCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: "OK" | "NOK" | "NA") => {
    const variants = {
      OK: "bg-green-100 text-green-800 border-green-300",
      NOK: "bg-red-100 text-red-800 border-red-300",
      NA: "bg-gray-100 text-gray-800 border-gray-300",
    };

    return (
      <Badge variant="outline" className={cn(variants[status], "font-medium")}>
        {status}
      </Badge>
    );
  };

  const okCount = items.filter((item) => item.status === "OK").length;
  const nokCount = items.filter((item) => item.status === "NOK").length;
  const naCount = items.filter((item) => item.status === "NA").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Checklist de Inspeção</span>
          <div className="flex gap-4 text-sm font-normal">
            <span className="text-green-600">{okCount} OK</span>
            <span className="text-red-600">{nokCount} NOK</span>
            <span className="text-gray-600">{naCount} N/A</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-4 rounded-lg border transition-colors",
                item.status === "NOK" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{item.item}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  {item.observacao && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Observação:</span> {item.observacao}
                    </p>
                  )}
                  {item.foto && (
                    <button
                      onClick={() => onPhotoClick?.(item.foto!)}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ver foto anexada
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
