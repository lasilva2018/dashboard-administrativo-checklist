import { baserowGet } from "@/lib/baserow";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const query =
    `table/746/?user_field_names=true&filter__field_inspecao__contains=${id}`;

  const data = await baserowGet(query);
  return Response.json(data);
}
