"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import InspectionTable from "@/components/InspectionTable";
import Pagination from "@/components/Pagination";
import { getInspecoes, getDashboardStats } from "@/lib/api";
import { exportToPDF, exportToExcel } from "@/lib/export";
import { StatusFilter } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  History, 
  FileText, 
  FileSpreadsheet,
  Search,
  X,
  Calendar as CalendarIcon,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 50;

export default function HistoricoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: stats } = useSWR("dashboard-stats", getDashboardStats);
  const { data: allInspecoes, isLoading } = useSWR("all-inspecoes", () => getInspecoes("all"));

  const filteredInspecoes = useMemo(() => {
    if (!allInspecoes) return [];
    let filtered = [...allInspecoes];

    if (statusFilter !== "all") {
      const statusMap: Record<StatusFilter, string> = {
        all: "", pendente: "Pendente Aprovação", aprovada: "Aprovada", reprovada: "Reprovada",
      };
      filtered = filtered.filter((insp) => insp.status === statusMap[statusFilter]);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((insp) =>
        insp.condominio.toLowerCase().includes(term) || insp.zelador.toLowerCase().includes(term)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((insp) => new Date(insp.data) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((insp) => new Date(insp.data) <= toDate);
    }

    return filtered;
  }, [allInspecoes, statusFilter, searchTerm, dateFrom, dateTo]);

  const periodStats = useMemo(() => ({
    total: filteredInspecoes.length,
    pendentes: filteredInspecoes.filter(i => i.status === "Pendente Aprovação").length,
    aprovadas: filteredInspecoes.filter(i => i.status === "Aprovada").length,
    reprovadas: filteredInspecoes.filter(i => i.status === "Reprovada").length,
  }), [filteredInspecoes]);

  const totalPages = Math.ceil(filteredInspecoes.length / ITEMS_PER_PAGE);
  const paginatedInspecoes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInspecoes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInspecoes, currentPage]);

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
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleExportPDF = () => {
    if (filteredInspecoes.length === 0) {
      toast.error("Nenhuma inspeção para exportar");
      return;
    }
    try {
      let titulo = "Relatório de Inspeções";
      if (dateFrom && dateTo) titulo += ` - Período: ${dateFrom} a ${dateTo}`;
      exportToPDF(filteredInspecoes, titulo);
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleExportExcel = () => {
    if (filteredInspecoes.length === 0) {
      toast.error("Nenhuma inspeção para exportar");
      return;
    }
    try {
      exportToExcel(filteredInspecoes);
      toast.success("Planilha Excel gerada com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar Excel");
    }
  };

  const pendingCount = stats?.pendentes || 0;
  const hasActiveFilters = searchTerm || statusFilter !== "all" || dateFrom || dateTo;

  return (
    <AuthGuard>
      {(user) => (
        <DashboardLayout user={user} pendingCount={pendingCount}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <History className="w-8 h-8 text-primary" />
                  Histórico
                </h2>
                <p className="text-gray-600 mt-1">Visualize e exporte relatórios de inspeções</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleExportPDF} variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button onClick={handleExportExcel} variant="outline">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Total</p><p className="text-2xl font-bold">{periodStats.total}</p></div><ClipboardList className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Pendentes</p><p className="text-2xl font-bold">{periodStats.pendentes}</p></div><Clock className="w-8 h-8 text-yellow-600" /></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Aprovadas</p><p className="text-2xl font-bold">{periodStats.aprovadas}</p></div><CheckCircle className="w-8 h-8 text-green-600" /></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Reprovadas</p><p className="text-2xl font-bold">{periodStats.reprovadas}</p></div><XCircle className="w-8 h-8 text-red-600" /></div></CardContent></Card>
            </div>

            <Card><CardContent className="pt-6"><div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="pl-10" /></div>
              <Select value={statusFilter} onValueChange={(value) => handleFilterChange(value as StatusFilter)}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="pendente">Pendentes</SelectItem><SelectItem value="aprovada">Aprovadas</SelectItem><SelectItem value="reprovada">Reprovadas</SelectItem></SelectContent></Select>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} className="pl-10" /></div>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} className="pl-10" /></div>
            </div>{hasActiveFilters && <Button variant="outline" onClick={handleClearFilters}><X className="w-4 h-4 mr-2" />Limpar filtros</Button>}</div></CardContent></Card>

            {isLoading ? <Skeleton className="h-96 w-full" /> : (<><InspectionTable inspecoes={paginatedInspecoes} />{filteredInspecoes.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredInspecoes.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}</>)}
          </div>
        </DashboardLayout>
      )}
    </AuthGuard>
  );
}
