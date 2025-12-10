const BASEROW_URL = process.env.BASEROW_URL;
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

async function baserowRequest(
  method: "GET" | "POST" | "PATCH",
  path: string,
  body?: any
) {
  if (!BASEROW_URL || !BASEROW_TOKEN) {
    throw new Error("Baserow env vars missing!");
  }

  // 🔥 Normaliza caminho para NÃO duplicar "/api/database/rows/"
  const cleanPath = path.replace(/^\/?api\/database\/rows\//, "").replace(/^\//, "");

  const url = `${BASEROW_URL}/api/database/rows/${cleanPath}`;
  console.log("📡 BASEROW REQUEST →", url);

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("❌ BASEROW ERROR:", err);
    throw new Error(err?.detail || `Erro Baserow ${res.status}`);
  }

  return res.json();
}

export async function baserowGet(path: string) {
  return baserowRequest("GET", path);
}

export async function baserowPost(path: string, body: any) {
  return baserowRequest("POST", path, body);
}

export async function baserowPatch(path: string, body: any) {
  return baserowRequest("PATCH", path, body);
}
