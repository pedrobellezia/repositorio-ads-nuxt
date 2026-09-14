import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

type ProfileRow = { id: string; role: string; display_name: string | null };

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Não autenticado." });
  }

  const supabase = await serverSupabaseClient<any>(event);
  const { data: requesterProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub)
    .single();

  if (requesterProfile?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Acesso restrito ao admin.",
    });
  }

  const admin = serverSupabaseServiceRole<any>(event);

  const [{ data: usersData }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers(),
    supabase.from("profiles").select("id, role, display_name"),
  ]);

  const profileById = new Map(
    (profiles as ProfileRow[] | null)?.map((p) => [p.id, p]),
  );

  return (usersData?.users ?? []).map((u: { id: string; email?: string }) => ({
    id: u.id,
    email: u.email,
    role: profileById.get(u.id)?.role ?? "professor",
    displayName: profileById.get(u.id)?.display_name,
  }));
});
