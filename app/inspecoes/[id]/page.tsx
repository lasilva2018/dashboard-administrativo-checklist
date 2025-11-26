"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import ChecklistItems from "@/components/ChecklistItems";
import ApprovalDialog from "@/components/ApprovalDialog";
import { getInspecao, getDashboardStats, aprovarInspecao, reprovarInspecao } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { exportInspecaoToPDF, exportInspecaoToExcel } from "@/lib/export";

export default function InspecaoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<"approve" | "reject">("approve");
  const [photoModalUrl, setPhotoModalUrl] = useState<string | null>(null);
  const currentUserRef = useRef<any>(null);

  const { data: stats } = useSWR("dashboard-stats", getDashboardStats);
  const { data: inspecao, isLoading } = useSWR(`inspecao-${id}`, () => getInspecao(id));

  const handleApprove = () => {
    setApprovalType("approve");
    setApprovalDialogOpen(true);
  };

  const handleReject = () => {
    setApprovalType("reject");
    setApprovalDialogOpen(true);
  };

  const handleConfirmAction = async (comentario?: string) => {
    try {
      const aprovadoPor = currentUserRef.current?.displayName || currentUserRef.current?.email || "Admin";
      
      if (approvalType === "approve") {
        await aprovarInspecao(id, comentario, aprovadoPor);
        toast.success("Inspeção aprovada com sucesso!");
      } else {
        if (!comentario) {
          toast.error("O motivo da reprovação é obrigatório");
          return;
        }
        await reprovarInspecao(id, comentario, aprovadoPor);
        toast.success("Inspeção reprovada com sucesso!");
      }

      // Revalidar dados
      mutate(`inspecao-${id}`);
      mutate("dashboard-stats");
      mutate("all-inspecoes");
      mutate("inspecoes-recentes");
    } catch (error) {
      toast.error("Erro ao processar a ação. Tente novamente.");
      throw error;
    }
  };

  const pendingCount = stats?.pendentes || 0;

  if (isLoading) {
    return (
      <AuthGuard>
        {(user) => (
          <DashboardLayout user={user} pendingCount={pendingCount}>
            <div className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-96 w-full" />
            </div>
          </DashboardLayout>
        )}
      </AuthGuard>
    );
  }

  if (!inspecao) {
    return (
      <AuthGuard>
        {(user) => (
          <DashboardLayout user={user} pendingCount={pendingCount}>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Inspeção não encontrada
              </h2>
              <p className="text-gray-600 mb-6">
                A inspeção #{id} não existe ou foi removida.
              </p>
              <Link href="/inspecoes">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para inspeções
                </Button>
              </Link>
            </div>
          </DashboardLayout>
        )}
      </AuthGuard>
    );
  }

  const isPending = inspecao.status === "Pendente Aprovação";

  return (
    <AuthGuard>
      {(user) => {
        // Armazenar usuário no ref (não causa re-render)
        currentUserRef.current = user;
        
        return (
        <DashboardLayout user={user} pendingCount={pendingCount}>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/inspecoes">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Inspeção #{inspecao.id}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Detalhes completos da inspeção predial
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    try {
                      exportInspecaoToPDF(inspecao);
                      toast.success("PDF gerado com sucesso!");
                    } catch (error) {
                      toast.error("Erro ao gerar PDF");
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    try {
                      exportInspecaoToExcel(inspecao);
                      toast.success("Excel gerado com sucesso!");
                    } catch (error) {
                      toast.error("Erro ao gerar Excel");
                    }
                  }}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <StatusBadge status={inspecao.status} className="text-lg px-4 py-2" />
              </div>
            </div>

            {/* Informações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Condomínio</p>
                      <p className="font-semibold text-gray-900">{inspecao.condominio}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Zelador Responsável</p>
                      <p className="font-semibold text-gray-900">{inspecao.zelador}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Data da Inspeção</p>
                      <p className="font-semibold text-gray-900">{formatDate(inspecao.data)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Total de Itens</p>
                      <p className="font-semibold text-gray-900">{inspecao.itens.length} itens verificados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Aprovação */}
            {inspecao.aprovadoPor && (
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Aprovado/Reprovado por</p>
                        <p className="font-semibold text-gray-900">{inspecao.aprovadoPor}</p>
                      </div>
                    </div>
                    {inspecao.dataAprovacao && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Data da Decisão</p>
                          <p className="font-semibold text-gray-900">
                            {formatDateTime(inspecao.dataAprovacao)}
                          </p>
                        </div>
                      </div>
                    )}
                    {inspecao.comentarioSindico && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Comentário do Síndico</p>
                          <p className="text-gray-900 mt-1">{inspecao.comentarioSindico}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Checklist */}
            <ChecklistItems 
              items={inspecao.itens} 
              onPhotoClick={(url) => setPhotoModalUrl(url)}
            />

            {/* Ações */}
            {isPending && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleApprove}
                      className="flex-1"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Aprovar Inspeção
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex-1"
                      size="lg"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reprovar Inspeção
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Dialog de Aprovação/Reprovação */}
          <ApprovalDialog
            open={approvalDialogOpen}
            onOpenChange={setApprovalDialogOpen}
            type={approvalType}
            onConfirm={handleConfirmAction}
            inspecaoId={id}
          />

          {/* Modal de Foto (placeholder) */}
          {photoModalUrl && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setPhotoModalUrl(null)}
            >
              <div className="bg-white rounded-lg p-4 max-w-4xl w-full">
                <p className="text-center text-gray-600 mb-4">
                  Visualizador de fotos (placeholder)
                </p>
                <p className="text-sm text-gray-500 text-center">
                  URL da foto: {photoModalUrl}
                </p>
                <Button
                  onClick={() => setPhotoModalUrl(null)}
                  className="mt-4 mx-auto block"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DashboardLayout>
        );
      }}
    </AuthGuard>
  );
}
