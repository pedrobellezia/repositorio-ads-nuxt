<script setup lang="ts">
import { reactive, ref } from "vue";
import type { CategoryWithSubs, ItemWithTags, Tag } from "@/lib/types";

const props = defineProps<{
  item: ItemWithTags;
  tags: Tag[];
  categories: CategoryWithSubs[];
}>();

const { updateItem } = useItemActions();

const editing = ref(false);
const pending = ref(false);
const errorMessage = ref<string | null>(null);

const form = reactive({
  name: props.item.name,
  description: props.item.description,
  category_id: props.item.subcategory?.category_id ?? "",
  subcategory_id: props.item.subcategory_id ?? "",
  professor_name: props.item.professor_name ?? "",
  link_url: props.item.link_url ?? "",
});
const tagIds = ref(new Set(props.item.tags.map((t) => t.id)));
const file = ref<File | null>(null);

async function handleSubmit() {
  errorMessage.value = null;
  pending.value = true;
  try {
    await updateItem(props.item.id, {
      ...form,
      tagIds: Array.from(tagIds.value),
      file: file.value,
    });
    editing.value = false;
    file.value = null;
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : "Erro ao salvar item.";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)] transition-shadow hover:shadow-[0_0.5rem_1.5rem_-0.5rem_rgba(3,46,71,0.16)]"
  >
    <div>
      <p class="font-heading font-semibold text-secondary">{{ item.name }}</p>
      <div class="mt-1 flex flex-wrap items-center gap-1.5">
        <UiBadge v-if="item.subcategory" variant="outline">
          {{ item.subcategory.category.name }} › {{ item.subcategory.name }}
        </UiBadge>
        <UiBadge v-else variant="outline" class="text-slate-400">
          Sem categoria
        </UiBadge>
        <UiBadge v-for="tag in item.tags" :key="tag.id">{{ tag.name }}</UiBadge>
      </div>
    </div>
    <div class="flex gap-2">
      <UiButton variant="outline" size="sm" @click="editing = true">
        Editar
      </UiButton>
      <AdminDeleteItemButton :item-id="item.id" />
    </div>

    <UiModal v-model:open="editing" class="max-h-[85vh] max-w-lg overflow-y-auto">
      <template #title>Editar item</template>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AdminItemFormFields
          v-model:form="form"
          v-model:tag-ids="tagIds"
          :tags="tags"
          :categories="categories"
          :has-existing-file="!!item.file_path"
          @file-change="(f) => (file = f)"
        />
        <div class="mt-6 space-y-3">
          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>
          <div class="flex justify-end gap-2">
            <UiButton type="button" variant="ghost" @click="editing = false">
              Cancelar
            </UiButton>
            <UiButton type="submit" :disabled="pending">
              {{ pending ? "Salvando..." : "Salvar" }}
            </UiButton>
          </div>
        </div>
      </form>
    </UiModal>
  </div>
</template>
