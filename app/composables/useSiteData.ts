import type {
  Category,
  CategoryWithSubs,
  Item,
  ItemWithTags,
  Subcategory,
  Tag,
} from "@/lib/types";

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
        `id, name, description, subcategory_id, professor_name, link_url, file_path,
         item_tags(tag:tags(id, name, slug, icon)),
         subcategory:subcategories(id, category_id, name, slug, position,
           category:categories(id, name, slug, color, position))`,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    type RawItem = Item & {
      item_tags: { tag: Tag }[];
      subcategory: (Subcategory & { category: Category }) | null;
    };

    return (
      (data as unknown as RawItem[] | null) ?? []
    ).map((row) => {
      const { item_tags, subcategory, ...item } = row;
      return {
        ...item,
        tags: item_tags.map((it) => it.tag),
        subcategory: subcategory ?? null,
      };
    });
  });
}

export function useTags() {
  const supabase = useSupabaseClient<any>();
  const config = useRuntimeConfig();

  return useAsyncData<Tag[]>("tags", async () => {
    if (config.public.mockTrue) {
      const { mockTags } = await import("~~/server/mock-data");
      return mockTags;
    }

    const { data, error } = await supabase
      .from("tags")
      .select("id, name, slug, icon")
      .order("name");

    if (error) throw error;
    return (data as unknown as Tag[] | null) ?? [];
  });
}

export function useCategories() {
  const supabase = useSupabaseClient<any>();
  const config = useRuntimeConfig();

  return useAsyncData<CategoryWithSubs[]>("categories", async () => {
    if (config.public.mockTrue) {
      const { mockCategories } = await import("~~/server/mock-data");
      return mockCategories;
    }

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name, slug, color, position, subcategories(id, category_id, name, slug, position)",
      )
      .order("position")
      .order("position", { referencedTable: "subcategories" });

    if (error) throw error;
    return (data as unknown as CategoryWithSubs[] | null) ?? [];
  });
}
