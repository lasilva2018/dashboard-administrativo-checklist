"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import InspectionFilters from "@/components/InspectionFilters";
import InspectionTable from "@/components/InspectionTable";
import Pagination from "@/components/Pagination";
import { getInspecoes, getDashboardStats } from "@/lib/api";
import { StatusFilter } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";

const ITEMS_PER_PAGE = 50;

export default function InspecoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: stats } = useSWR("dashboard-stats", getDashboardStats);
  const { data: allInspecoes, isLoading } = useSWR("all-inspecoes", () => getInspecoes("all"));

  // Filtrar inspeções
  const filteredInspecoes = useMemo(() => {
    if (!allInspecoes) return [];

    let filtered = [...allInspecoes];

    // Filtro de status
    if (statusFilter !== "all") {
      const statusMap: Record<StatusFilter, string> = {
        all: "",
        pendente: "Pendente Aprovação",
        aprovada: "Aprovada",
        reprovada: "Reprovada",
      };
      filtered = filtered.filter((insp) => insp.status === statusMap[statusFilter]);
    }

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (insp) =>
          insp.condominio.toLowerCase().includes(term) ||
          insp.zelador.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [allInspecoes, statusFilter, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredInspecoes.length / ITEMS_PER_PAGE);
  const paginatedInspecoes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredInspecoes.slice(startIndex, endIndex);
  }, [filteredInspecoes, currentPage]);

  // Reset página quando filtros mudarem
  const handleFilterChange = (newFilter: StatusFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const pendingCount = stats?.pendentes || 0;

  return (
    <AuthGuard>
      {(user) => (
        <DashboardLayout user={user} pendingCount={pendingCount}>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <ClipboardList className="w-8 h-8 text-primary" />
                  Inspeções
                </h2>
                <p className="text-gray-600 mt-1">
                  Gerencie todas as inspeções prediais
                </p>
              </div>
            </div>

            {/* Filtros */}
            <InspectionFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Resultados */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
              <>
                <InspectionTable inspecoes={paginatedInspecoes} />

                {filteredInspecoes.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredInspecoes.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </DashboardLayout>
      )}
    </AuthGuard>
  );
}
