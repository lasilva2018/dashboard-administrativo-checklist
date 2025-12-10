"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

import { useAuth } from "@/context/AuthContext"; // 🔥 NOVO: importa o contexto global

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // 🔥 NOVO: agora sabemos se já existe usuário logado
  const [signingIn, setSigningIn] = useState(false);

  // 🔥 Se o usuário já estiver logado, redireciona automaticamente
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const handleLogin = async () => {
    try {
      setSigningIn(true);
      await signInWithPopup(auth, googleProvider);

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[oklch(0.38_0.15_264)] via-[oklch(0.45_0.16_264)] to-[oklch(0.55_0.18_264)] p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[oklch(0.38_0.15_264)] to-[oklch(0.55_0.18_264)] p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white px-6 py-3 rounded-lg">
              <img
                src="/logo-pensou.png"
                alt="Grupo Pensou"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard Administrativo Predial
          </h1>
        </div>

        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Faça login para continuar
              </h2>
              <p className="text-sm text-gray-600">
                Use sua conta Google para acessar o sistema
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={signingIn}
              className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-50 text-[oklch(0.38_0.15_264)] border-2 border-[oklch(0.38_0.15_264)] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {signingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Entrar com Google
                </>
              )}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Ao fazer login, você concorda com os termos de uso e política de privacidade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
