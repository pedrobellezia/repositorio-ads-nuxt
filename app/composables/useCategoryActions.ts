export function useCategoryActions() {
  const supabase = useSupabaseClient<any>();

  // ── Categories ────────────────────────────────────────────

  async function createCategory(name: string, color: string) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const { error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug, color });

    if (error) throw error;
    await refreshNuxtData(["categories", "public-items"]);
  }

  async function deleteCategory(categoryId: string) {
    // Check for items linked to any subcategory of this category
    const { count, error: countError } = await supabase
      .from("items")
      .select("id", { count: "exact", head: true })
      .in(
        "subcategory_id",
        supabase
          .from("subcategories")
          .select("id")
          .eq("category_id", categoryId),
      );

    if (countError) throw countError;

    if ((count ?? 0) > 0) {
      throw new Error(
        `Não é possível excluir: existem ${count} item(s) vinculado(s) a subcategorias desta categoria.`,
      );
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
    await refreshNuxtData(["categories", "public-items"]);
  }

  // ── Subcategories ─────────────────────────────────────────

  async function createSubcategory(
    categoryId: string,
    name: string,
  ) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const { error } = await supabase
      .from("subcategories")
      .insert({ category_id: categoryId, name: name.trim(), slug });

    if (error) throw error;
    await refreshNuxtData(["categories", "public-items"]);
  }

  async function deleteSubcategory(subcategoryId: string) {
    const { count, error: countError } = await supabase
      .from("items")
      .select("id", { count: "exact", head: true })
      .eq("subcategory_id", subcategoryId);

    if (countError) throw countError;

    if ((count ?? 0) > 0) {
      throw new Error(
        `Não é possível excluir: existem ${count} item(s) vinculado(s) a esta subcategoria.`,
      );
    }

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", subcategoryId);

    if (error) throw error;
    await refreshNuxtData(["categories", "public-items"]);
  }

  return {
    createCategory,
    deleteCategory,
    createSubcategory,
    deleteSubcategory,
  };
}
