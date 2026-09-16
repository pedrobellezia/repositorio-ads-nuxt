<script setup lang="ts">
import { reactive, ref } from "vue";
import type { Phase, Tag } from "@/lib/types";

const props = defineProps<{
  tags: Tag[];
  // Preenchido automaticamente com o professor logado; fica vazio (item
  // geral) quando quem cria é admin. Não é editável na criação.
  professorName?: string | null;
}>();

const { createItem } = useItemActions();

const open = ref(false);
const pending = ref(false);
const errorMessage = ref<string | null>(null);

function emptyForm() {
  return {
    name: "",
    description: "",
    phase: "geral" as Phase,
    professor_name: props.professorName ?? "",
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
  errorMessage.value = null;
}

async function handleSubmit() {
  errorMessage.value = null;
  pending.value = true;
  try {
    await createItem({
      ...form,
      tagIds: Array.from(tagIds.value),
      file: file.value,
    });
    open.value = false;
    resetForm();
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : "Erro ao criar item.";
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
        :tags="tags"
        hide-professor-field
        @file-change="(f) => (file = f)"
      />
      <div class="mt-6 space-y-3">
        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>
        <div class="flex justify-end gap-2">
          <UiButton type="button" variant="ghost" @click="open = false">
            Cancelar
          </UiButton>
          <UiButton type="submit" :disabled="pending">
            {{ pending ? "Salvando..." : "Criar item" }}
          </UiButton>
        </div>
      </div>
    </form>
  </UiModal>
</template>
