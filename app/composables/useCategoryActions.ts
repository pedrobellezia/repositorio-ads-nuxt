function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useCategoryActions() {
  const supabase = useSupabaseClient<any>();

  async function createCategory(name: string) {
    const { error } = await supabase
      .from("tag_categories")
      .insert({ name: name.trim(), slug: slugify(name) });

    if (error) throw error;
    await refreshNuxtData(["tag-categories"]);
  }

  async function deleteCategory(categoryId: string) {
    const { error } = await supabase
      .from("tag_categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
    await refreshNuxtData(["tag-categories"]);
  }

  return { createCategory, deleteCategory };
}
