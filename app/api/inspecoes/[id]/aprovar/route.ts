import { baserowPatch } from "@/lib/baserow";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  
  const data = await baserowPatch(`table/745/${id}/?user_field_names=true`, {
    status: "Aprovado Admin",
    "Aprovado Por": body.aprovadoPor || "Admin"
  });

  return Response.json({ ok: true, data });
}
