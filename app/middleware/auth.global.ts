export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const isAdminRoute = to.path.startsWith("/admin");

  if (isAdminRoute && !user.value) {
    return navigateTo({ path: "/login", query: { next: to.fullPath } });
  }

  const isAdminOnlyRoute = to.path.startsWith("/admin/professors");

  if (isAdminOnlyRoute && user.value) {
    const supabase = useSupabaseClient<any>();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.value.sub)
      .single();

    if (profile?.role !== "admin") {
      return navigateTo({ path: "/admin", query: { error: "acesso-restrito" } });
    }
  }
});
