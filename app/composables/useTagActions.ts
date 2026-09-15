import type { SimilarTag } from "@/lib/types";

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useTagActions() {
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  async function searchSimilarTags(name: string): Promise<SimilarTag[]> {
    const { data, error } = await supabase.rpc("search_similar_tags", {
      p_name: name,
    });

    if (error) throw error;
    return data ?? [];
  }

  async function createTag(name: string, icon: string) {
    const { error } = await supabase.from("tags").insert({
      name: name.trim(),
      slug: slugify(name),
      icon,
      created_by: user.value?.sub ?? null,
    });

    if (error) throw error;
    await refreshNuxtData(["tags"]);
  }

  async function deleteTag(tagId: string) {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    if (error) throw error;
    await refreshNuxtData(["tags"]);
  }

  return { searchSimilarTags, createTag, deleteTag };
}
