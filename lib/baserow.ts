/**
 * Funções de conexão segura com Baserow
 * Token nunca é exposto ao frontend
 */

export async function baserowGet(path: string) {
  const url = `${process.env.BASEROW_URL}/${path}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${process.env.BASEROW_TOKEN}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Erro Baserow GET: ${res.status}`);
  }

  return res.json();
}

export async function baserowPatch(path: string, data: any) {
  const url = `${process.env.BASEROW_URL}/${path}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${process.env.BASEROW_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Erro Baserow PATCH: ${res.status}`);
  }

  return res.json();
}
