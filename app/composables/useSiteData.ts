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
      .select("*, item_tags(tag:tags(*))")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (
      (data as (Item & { item_tags: { tag: Tag }[] })[] | null) ?? []
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
      .select("*, tags(*)")
      .order("name");

    if (error) throw error;
    return (data as CategoryWithTags[] | null) ?? [];
  });
}
