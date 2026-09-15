import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { email, password, next } = await readBody<{
    email: string;
    password: string;
    next?: string;
  }>(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "E-mail e senha são obrigatórios.",
    });
  }

  const supabase = await serverSupabaseClient<any>(event);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "E-mail ou senha inválidos.",
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  // /professores é exclusivo de admin: se um professor chegou aqui com um
  // "next" pra lá (ex: link salvo/compartilhado), manda pro dashboard padrão
  // em vez de deixar o middleware bater e voltar pro login.
  const wantsAdminOnlyArea = next?.startsWith("/professores");
  const redirectTo = next && (isAdmin || !wantsAdminOnlyArea) ? next : "/items";

  return { role: profile?.role ?? "professor", redirectTo };
});
