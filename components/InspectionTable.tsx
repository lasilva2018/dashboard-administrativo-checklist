"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Inspecao } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Eye, Building2, User } from "lucide-react";

interface InspectionTableProps {
  inspecoes: Inspecao[];
}

export default function InspectionTable({ inspecoes }: InspectionTableProps) {
  if (inspecoes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Building2 className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma inspeção encontrada
        </h3>
        <p className="text-gray-600">
          Tente ajustar os filtros para encontrar o que procura.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Condomínio</TableHead>
              <TableHead>Zelador</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspecoes.map((inspecao) => {
              const itemsNOK = inspecao.itens.filter((item) => item.status === "NOK").length;
              const itemsOK = inspecao.itens.filter((item) => item.status === "OK").length;

              return (
                <TableRow key={inspecao.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">#{inspecao.id}</TableCell>
                  <TableCell>{formatDate(inspecao.data)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{inspecao.condominio}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{inspecao.zelador}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-gray-600">{inspecao.itens.length} total</span>
                      {itemsNOK > 0 && (
                        <span className="ml-2 text-red-600 font-medium">
                          ({itemsNOK} NOK)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={inspecao.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/inspecoes/${inspecao.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
