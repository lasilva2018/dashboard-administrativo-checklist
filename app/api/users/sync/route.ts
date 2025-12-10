import { NextRequest, NextResponse } from "next/server";
import { findUserByUid, createUser } from "@/lib/baserowUsers";

export async function POST(req: NextRequest) {
  try {
    const { uid, nome, email, papel } = await req.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "uid e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se já existe
    const existing = await findUserByUid(uid);

    if (existing) {
      return NextResponse.json({ ok: true, user: existing, created: false });
    }

    // Cria novo
    const created = await createUser({ uid, nome: nome || "", email, papel });

    return NextResponse.json({ ok: true, user: created, created: true });
  } catch (error: any) {
    console.error("Erro ao sincronizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar usuário" },
      { status: 500 }
    );
  }
}
