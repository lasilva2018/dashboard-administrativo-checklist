import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("📥 RECEBIDO PARA SYNC");

  try {
    const { uid, nome, email, papel } = await req.json();
    console.log("➡ Dados recebidos:", { uid, nome, email, papel });

    // -------------------------------
    // 🔐 VARIÁVEIS DE AMBIENTE
    // -------------------------------
    const BASEROW_URL = process.env.BASEROW_URL;
    const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
    const BASEROW_USERS_TABLE_ID = process.env.BASEROW_USERS_TABLE_ID;

    if (!BASEROW_URL || !BASEROW_TOKEN || !BASEROW_USERS_TABLE_ID) {
      console.error("❌ Variáveis de ambiente faltando");
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    // ----------------------------------------------------
    // 🔍 1. BUSCAR USUÁRIO PELO UID
    // ----------------------------------------------------
    const findUrl = `${BASEROW_URL}/api/database/rows/table/${BASEROW_USERS_TABLE_ID}/?user_field_names=true&filter__uid__equal=${uid}`;

    console.log("🔎 Consultando Baserow:", findUrl);

    const findRes = await fetch(findUrl, {
      method: "GET",
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
      },
    });

    const findData = await findRes.json();
    console.log("🔍 RESPOSTA FIND:", findData);

    const existing = findData?.results?.[0];

    if (existing && existing.id) {
      console.log("✔ Usuário já existe no Baserow (pelo UID)");
      return NextResponse.json({
        status: "ok",
        message: "Usuário já existia, não recriado.",
        user: existing,
      });
    }

    // ----------------------------------------------------
    // 🆕 2. CRIAR NOVO USUÁRIO
    // ----------------------------------------------------
    console.log("➕ Criando novo usuário no Baserow…");

    const createRes = await fetch(
      `${BASEROW_URL}/api/database/rows/table/${BASEROW_USERS_TABLE_ID}/?user_field_names=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          nome,
          email,
          papel,
          ativo: true,
        }),
      }
    );

    const createData = await createRes.json();
    console.log("🎉 Usuário criado:", createData);

    if (!createRes.ok) {
      console.error("❌ Erro ao criar usuário:", createData);
      return NextResponse.json(
        { error: "Erro ao criar usuário", details: createData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "created",
      user: createData,
    });
  } catch (err) {
    console.error("❌ ERRO GERAL:", err);
    return NextResponse.json({ error: "Erro interno", details: err }, { status: 500 });
  }
}
