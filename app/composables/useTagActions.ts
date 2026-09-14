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

  async function searchSimilarTags(
    categoryId: string,
    name: string,
  ): Promise<SimilarTag[]> {
    const { data, error } = await supabase.rpc("search_similar_tags", {
      p_category_id: categoryId,
      p_name: name,
    });

    if (error) throw error;
    return data ?? [];
  }

  async function createTag(categoryId: string, name: string, icon: string) {
    const { error } = await supabase.from("tags").insert({
      category_id: categoryId,
      name: name.trim(),
      slug: slugify(name),
      icon,
      created_by: user.value?.sub ?? null,
    });

    if (error) throw error;
    await refreshNuxtData(["tag-categories"]);
  }

  async function deleteTag(tagId: string) {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    if (error) throw error;
    await refreshNuxtData(["tag-categories"]);
  }

  return { searchSimilarTags, createTag, deleteTag };
}
