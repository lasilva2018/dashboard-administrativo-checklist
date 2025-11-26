"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  pendingCount?: number;
}

export default function DashboardLayout({
  children,
  user,
  pendingCount = 0,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout realizado com sucesso!");
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main content */}
      <div className="md:pl-64">
        <Header
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          pendingCount={pendingCount}
        />

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onLogout={handleLogout} />
          </div>
        </div>
      )}
    </div>
  );
}
