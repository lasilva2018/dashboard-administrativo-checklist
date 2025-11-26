import { baserowGet } from "@/lib/baserow";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = "table/745/?user_field_names=true";

  if (status) {
    query += `&filter__field_status__equal=${status}`;
  }

  const data = await baserowGet(query);
  return Response.json(data);
}
