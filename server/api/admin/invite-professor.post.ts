import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Não autenticado." });
  }

  const supabase = await serverSupabaseClient<any>(event);
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub)
    .single();

  if (profile?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Acesso restrito ao admin.",
    });
  }

  const body = await readBody<{
    email?: string;
    password?: string;
    display_name?: string;
  }>(event);

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Informe e-mail e senha.",
    });
  }

  const admin = serverSupabaseServiceRole(event);

  const { error } = await admin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: { display_name: body.display_name ?? null },
  });

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message });
  }

  return { ok: true };
});
