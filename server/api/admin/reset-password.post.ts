import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { generateTempPassword } from "../../utils/generate-temp-password";

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

  const { userId } = await readBody<{ userId?: string }>(event);

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: "Informe o usuário." });
  }

  if (userId === user.sub) {
    throw createError({
      statusCode: 400,
      statusMessage: "Você não pode resetar a própria senha por aqui.",
    });
  }

  const password = generateTempPassword();
  const admin = serverSupabaseServiceRole(event);

  const { error } = await admin.auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message });
  }

  return { password };
});
