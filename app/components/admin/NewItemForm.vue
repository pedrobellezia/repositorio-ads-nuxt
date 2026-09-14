<script setup lang="ts">
import { reactive, ref } from "vue";
import type { CategoryWithTags, Phase } from "@/lib/types";

const props = defineProps<{
  categories: CategoryWithTags[];
  defaultProfessorName?: string | null;
}>();

const { createItem } = useItemActions();

const open = ref(false);
const pending = ref(false);

function emptyForm() {
  return {
    name: "",
    description: "",
    phase: "geral" as Phase,
    professor_name: props.defaultProfessorName ?? "",
    link_url: "",
  };
}

const form = reactive(emptyForm());
const tagIds = ref(new Set<string>());
const file = ref<File | null>(null);

function resetForm() {
  Object.assign(form, emptyForm());
  tagIds.value = new Set();
  file.value = null;
}

async function handleSubmit() {
  pending.value = true;
  try {
    await createItem({
      ...form,
      tagIds: Array.from(tagIds.value),
      file: file.value,
    });
    open.value = false;
    resetForm();
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <UiButton @click="open = true">Novo item</UiButton>

  <UiModal v-model:open="open" class="max-h-[85vh] max-w-lg overflow-y-auto">
    <template #title>Novo item</template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <AdminItemFormFields
        v-model:form="form"
        v-model:tag-ids="tagIds"
        :categories="categories"
        @file-change="(f) => (file = f)"
      />
      <div class="mt-6 flex justify-end gap-2">
        <UiButton type="button" variant="ghost" @click="open = false">
          Cancelar
        </UiButton>
        <UiButton type="submit" :disabled="pending">
          {{ pending ? "Salvando..." : "Criar item" }}
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
