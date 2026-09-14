import type { CategoryWithTags, Item, ItemWithTags, Tag } from "@/lib/types";

export function usePublicItems() {
  const supabase = useSupabaseClient<any>();
  const config = useRuntimeConfig();

  return useAsyncData<ItemWithTags[]>("public-items", async () => {
    if (config.public.mockTrue) {
      const { mockItems } = await import("~~/server/mock-data");
      return mockItems;
    }

    const { data, error } = await supabase
      .from("items")
      .select(
        "id, name, description, phase, professor_name, link_url, file_path, item_tags(tag:tags(id, category_id, name, slug, icon))",
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (
      (data as unknown as (Item & { item_tags: { tag: Tag }[] })[] | null) ?? []
    ).map((row) => {
      const { item_tags, ...item } = row;
      return { ...item, tags: item_tags.map((it) => it.tag) };
    });
  });
}

export function useTagCategories() {
  const supabase = useSupabaseClient<any>();
  const config = useRuntimeConfig();

  return useAsyncData<CategoryWithTags[]>("tag-categories", async () => {
    if (config.public.mockTrue) {
      const { mockCategories } = await import("~~/server/mock-data");
      return mockCategories;
    }

    const { data, error } = await supabase
      .from("tag_categories")
      .select(
        "id, name, slug, tags(id, category_id, name, slug, icon)",
      )
      .order("name");

    if (error) throw error;
    return (data as unknown as CategoryWithTags[] | null) ?? [];
  });
}
