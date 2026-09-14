import type { SupabaseClient } from "@supabase/supabase-js";
import { ITEM_FILES_BUCKET, MAX_ITEM_FILE_SIZE_BYTES } from "@/lib/storage";
import type { Phase } from "@/lib/types";

export type ItemFormValues = {
  name: string;
  description: string;
  phase: Phase;
  professor_name: string;
  link_url: string;
  tagIds: string[];
  file: File | null;
};

async function uploadFileIfPresent(
  supabase: SupabaseClient,
  file: File | null,
) {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_ITEM_FILE_SIZE_BYTES) {
    throw new Error("Arquivo maior que o limite de 10MB.");
  }

  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(ITEM_FILES_BUCKET)
    .upload(path, file);
  if (error) throw error;

  return path;
}

async function setItemTags(
  supabase: SupabaseClient,
  itemId: string,
  tagIds: string[],
) {
  await supabase.from("item_tags").delete().eq("item_id", itemId);
  if (tagIds.length > 0) {
    await supabase
      .from("item_tags")
      .insert(tagIds.map((tagId) => ({ item_id: itemId, tag_id: tagId })));
  }
}

export function useItemActions() {
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  async function createItem(values: ItemFormValues) {
    const filePath = await uploadFileIfPresent(supabase, values.file);
    const linkUrl = values.link_url.trim() || null;

    if (!linkUrl && !filePath) {
      throw new Error("Informe um link externo ou envie um arquivo.");
    }

    const { data: item, error } = await supabase
      .from("items")
      .insert({
        name: values.name.trim(),
        description: values.description.trim(),
        phase: values.phase,
        professor_name: values.professor_name.trim() || null,
        link_url: linkUrl,
        file_path: filePath,
        created_by: user.value?.sub ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;

    await setItemTags(supabase, item.id, values.tagIds);
    await refreshNuxtData(["public-items"]);
  }

  async function updateItem(itemId: string, values: ItemFormValues) {
    const newFilePath = await uploadFileIfPresent(supabase, values.file);

    const update: Record<string, unknown> = {
      name: values.name.trim(),
      description: values.description.trim(),
      phase: values.phase,
      professor_name: values.professor_name.trim() || null,
      link_url: values.link_url.trim() || null,
    };

    if (newFilePath) {
      update.file_path = newFilePath;
    }

    const { error } = await supabase
      .from("items")
      .update(update)
      .eq("id", itemId);
    if (error) throw error;

    await setItemTags(supabase, itemId, values.tagIds);
    await refreshNuxtData(["public-items"]);
  }

  async function deleteItem(itemId: string) {
    const { data: item } = await supabase
      .from("items")
      .select("file_path")
      .eq("id", itemId)
      .single();

    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) throw error;

    if (item?.file_path) {
      await supabase.storage.from(ITEM_FILES_BUCKET).remove([item.file_path]);
    }

    await refreshNuxtData(["public-items"]);
  }

  return { createItem, updateItem, deleteItem };
}
