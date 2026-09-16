export function useAccountActions() {
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  async function updateDisplayName(displayName: string) {
    if (!user.value) throw new Error("Não autenticado.");

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() })
      .eq("id", user.value.sub);

    if (error) throw error;
    await refreshNuxtData("current-profile");
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await $fetch("/api/auth/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    });
  }

  return { updateDisplayName, changePassword };
}
