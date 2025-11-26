import { baserowGet } from "@/lib/baserow";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await baserowGet(`table/745/${id}/?user_field_names=true`);
  return Response.json(data);
}
