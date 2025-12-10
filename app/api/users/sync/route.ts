// /app/api/users/sync/route.ts

import { NextResponse } from "next/server";

const BASEROW_TOKEN = process.env.BASEROW_PAT;
const BASEROW_API = "https://baserow.automator-doa.com.br/api/database/rows/table/747/";
const HEADERS = {
  Authorization: `Token ${BASEROW_TOKEN}`,
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, nome, email, papel } = body;

    console.log("📥 RECEBIDO PARA SYNC:", body);

    if (!uid || !email) {
      console.log("❌ UID ou Email ausentes");
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    // 🔍 Busca aprimorada (ignora valores vazios)
    const filterUrl =
      `${BASEROW_API}?user_field_names=true` +
      `&filter__uid__equal=${encodeURIComponent(uid)}` +
      `&filter__uid__not_equal=`; // <-- ignora registros com uid vazio

    console.log("🔎 Consultando Baserow:", filterUrl);

    const res = await fetch(filterUrl, { method: "GET", headers: HEADERS });
    const data = await res.json();

    console.log("🔍 RESPOSTA FIND:", data);

    const exists = data?.results?.length > 0 ? data.results[0] : null;

    // =====================================================================================
    // CASO 1 — USUÁRIO JÁ EXISTE → Atualizar dados se necessário
    // =====================================================================================

    if (exists) {
      console.log("✔ Usuário encontrado:", exists);

      const updateUrl = `${BASEROW_API}${exists.id}/?user_field_names=true`;

      const updatePayload = {
        nome,
        email,
        papel,
        ativo: true,
      };

      console.log("♻ Atualizando usuário:", updatePayload);

      await fetch(updateUrl, {
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify(updatePayload),
      });

      return NextResponse.json({
        status: "updated",
        baserow_id: exists.id,
      });
    }

    // =====================================================================================
    // CASO 2 — USUÁRIO NÃO EXISTE → Criar novo
    // =====================================================================================

    console.log("➕ Criando novo usuário no Baserow…");

    const payload = {
      uid,
      nome,
      email,
      papel,
      ativo: true,
    };

    console.log("📦 Dados enviados ao Baserow:", payload);

    const createRes = await fetch(BASEROW_API, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload),
    });

    const created = await createRes.json();

    console.log("🎉 Usuário criado:", created);

    return NextResponse.json({
      status: "created",
      baserow_id: created.id,
    });

  } catch (error) {
    console.error("💥 ERRO EM /api/users/sync:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
