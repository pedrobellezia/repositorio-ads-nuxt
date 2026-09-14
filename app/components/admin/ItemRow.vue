<script setup lang="ts">
import { reactive, ref } from "vue";
import { PHASE_LABELS } from "@/lib/types";
import type { CategoryWithTags, ItemWithTags } from "@/lib/types";

const props = defineProps<{
  item: ItemWithTags;
  categories: CategoryWithTags[];
}>();

const { updateItem } = useItemActions();

const editing = ref(false);
const pending = ref(false);

const form = reactive({
  name: props.item.name,
  description: props.item.description,
  phase: props.item.phase,
  professor_name: props.item.professor_name ?? "",
  link_url: props.item.link_url ?? "",
});
const tagIds = ref(new Set(props.item.tags.map((t) => t.id)));
const file = ref<File | null>(null);

async function handleSubmit() {
  pending.value = true;
  try {
    await updateItem(props.item.id, {
      ...form,
      tagIds: Array.from(tagIds.value),
      file: file.value,
    });
    editing.value = false;
    file.value = null;
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-border/20 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)] transition-shadow hover:shadow-[0_0.5rem_1.5rem_-0.5rem_rgba(3,46,71,0.16)]"
  >
    <div>
      <p class="font-heading font-semibold text-secondary">{{ item.name }}</p>
      <div class="mt-1 flex flex-wrap items-center gap-1.5">
        <UiBadge variant="outline">{{ PHASE_LABELS[item.phase] }}</UiBadge>
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
          :categories="categories"
          :has-existing-file="!!item.file_path"
          @file-change="(f) => (file = f)"
        />
        <div class="mt-6 flex justify-end gap-2">
          <UiButton type="button" variant="ghost" @click="editing = false">
            Cancelar
          </UiButton>
          <UiButton type="submit" :disabled="pending">
            {{ pending ? "Salvando..." : "Salvar" }}
          </UiButton>
        </div>
      </form>
    </UiModal>
  </div>
</template>
