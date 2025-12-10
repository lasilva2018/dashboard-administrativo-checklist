const BASEROW_URL = process.env.BASEROW_URL; // ex: https://baserow.automator-doa.com.br/api/database/rows
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
const USUARIOS_TABLE_ID = process.env.BASEROW_USERS_TABLE_ID; // vamos colocar no .env

async function baserowRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASEROW_URL}/${path}`, {
    ...options,
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erro Baserow:", res.status, await res.text());
    throw new Error(`Erro Baserow: ${res.status}`);
  }

  return res.json();
}

// 🔍 busca usuário pelo UID
export async function findUserByUid(uid: string) {
  const query = `table/${USUARIOS_TABLE_ID}/?user_field_names=true&filter__field_uid__equal=${encodeURIComponent(
    uid
  )}`;
  const data = await baserowRequest(query);
  return data?.results?.[0] || null;
}

// ➕ cria novo usuário
export async function createUser(payload: {
  uid: string;
  nome: string;
  email: string;
  papel?: string;
}) {
  const body = {
    uid: payload.uid,
    nome: payload.nome,
    email: payload.email,
    papel: payload.papel || "zelador",
    ativo: true,
  };

  const data = await baserowRequest(`table/${USUARIOS_TABLE_ID}/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return data;
}
