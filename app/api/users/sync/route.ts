import { NextRequest, NextResponse } from "next/server";
import { findUserByUid, createUser } from "@/lib/baserowUsers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 RECEBIDO NA ROTA /api/users/sync:", body);

    const { uid, nome, email, papel } = body;

    if (!uid || !email) {
      console.log("❌ Faltando campos:", body);
      return NextResponse.json(
        { error: "uid e email são obrigatórios" },
        { status: 400 }
      );
    }

    console.log("🔎 Buscando usuário no Baserow pelo UID:", uid);
    const existing = await findUserByUid(uid);
    console.log("🔍 Resultado findUserByUid:", existing);

    if (existing) {
      console.log("✔ Usuário já existia — NÃO criar novamente");
      return NextResponse.json({ ok: true, user: existing, created: false });
    }

    console.log("➕ Criando usuário no Baserow...");
    const created = await createUser({
      uid,
      nome: nome || "",
      email,
      papel: papel || "zelador",
    });

    console.log("🎉 Usuário criado no Baserow:", created);

    return NextResponse.json({ ok: true, user: created, created: true });
  } catch (error: any) {
    console.error("💥 ERRO NO /api/users/sync:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao sincronizar usuário" },
      { status: 500 }
    );
  }
}
