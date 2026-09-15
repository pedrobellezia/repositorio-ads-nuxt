const PROTECTED_ROUTES = ["/items", "/tags", "/professores"];

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const isProtectedRoute = PROTECTED_ROUTES.some((path) =>
    to.path.startsWith(path),
  );

  if (isProtectedRoute && !user.value) {
    return navigateTo({ path: "/login", query: { next: to.fullPath } });
  }

  const isAdminOnlyRoute = to.path.startsWith("/professores");

  if (isAdminOnlyRoute && user.value) {
    const supabase = useSupabaseClient<any>();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.value.sub)
      .single();

    if (profile?.role !== "admin") {
      return navigateTo({ path: "/items", query: { error: "acesso-restrito" } });
    }
  }
});
