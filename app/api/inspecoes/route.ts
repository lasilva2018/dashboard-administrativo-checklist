import { baserowGet } from "@/lib/baserow";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  // ID correto da tabela de inspeções
  const TABLE_ID = process.env.BASEROW_INSPECOES_TABLE_ID || "745";

  // Construção segura da query
  let query = `table/${TABLE_ID}/?user_field_names=true`;

  if (status) {
    query += `&filter__field_status__equal=${status}`;
  }

  const data = await baserowGet(query);
  return Response.json(data);
}
