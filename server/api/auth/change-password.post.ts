import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user?.email) {
    throw createError({ statusCode: 401, statusMessage: "Não autenticado." });
  }

  const { currentPassword, newPassword } = await readBody<{
    currentPassword: string;
    newPassword: string;
  }>(event);

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Informe a senha atual e a nova senha.",
    });
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: "A nova senha precisa ter pelo menos 6 caracteres.",
    });
  }

  const supabase = await serverSupabaseClient<any>(event);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw createError({
      statusCode: 401,
      statusMessage: "Senha atual incorreta.",
    });
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw createError({ statusCode: 400, statusMessage: updateError.message });
  }

  return { ok: true };
});
