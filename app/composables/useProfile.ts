import type { Profile } from "@/lib/types";

export function useProfile() {
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  return useAsyncData<Profile | null>(
    "current-profile",
    async () => {
      if (!user.value) return null;

      const { data } = await supabase
        .from("profiles")
        .select("id, role, display_name")
        .eq("id", user.value.id)
        .single();

      return data as Profile | null;
    },
    { watch: [user] },
  );
}
