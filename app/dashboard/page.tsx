"use client";

import { useEffect } from "react";
import useSWR from "swr";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import InspectionCard from "@/components/InspectionCard";
import { getDashboardStats, getInspecoes } from "@/lib/api";
import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSWR("dashboard-stats", getDashboardStats);
  const { data: inspecoes, isLoading: inspecoesLoading } = useSWR("inspecoes-recentes", () =>
    getInspecoes("all")
  );

  const pendingCount = stats?.pendentes || 0;
  const recentInspecoes = inspecoes?.slice(0, 5) || [];

  return (
    <AuthGuard>
      {(user) => (
        <DashboardLayout user={user} pendingCount={pendingCount}>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-primary">
                Bem-vindo, {user.displayName}!
              </h2>
              <p className="text-muted-foreground mt-1">
                Acompanhe as inspeções prediais do seu condomínio
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </>
              ) : (
                <>
                  <StatsCard
                    title="Total de Inspeções"
                    value={stats?.total || 0}
                    icon={ClipboardList}
                    iconColor="text-primary"
                    iconBg="bg-primary/10"
                  />
                  <StatsCard
                    title="Pendentes"
                    value={stats?.pendentes || 0}
                    icon={Clock}
                    iconColor="text-yellow-600"
                    iconBg="bg-yellow-100"
                  />
                  <StatsCard
                    title="Aprovadas"
                    value={stats?.aprovadas || 0}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBg="bg-green-100"
                  />
                  <StatsCard
                    title="Reprovadas"
                    value={stats?.reprovadas || 0}
                    icon={XCircle}
                    iconColor="text-red-600"
                    iconBg="bg-red-100"
                  />
                </>
              )}
            </div>

            {/* Recent Inspections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary">
                  Últimas Inspeções
                </h3>
              </div>

              {inspecoesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : recentInspecoes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recentInspecoes.map((inspecao) => (
                    <InspectionCard key={inspecao.id} inspecao={inspecao} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma inspeção encontrada</p>
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      )}
    </AuthGuard>
  );
}
