<script setup lang="ts">
import { ref } from "vue";
import type { TagCategory } from "@/lib/types";

defineProps<{
  categories: TagCategory[];
}>();

const { createCategory, deleteCategory } = useCategoryActions();

const name = ref("");
const pending = ref(false);

async function handleCreate() {
  if (!name.value.trim()) return;
  pending.value = true;
  try {
    await createCategory(name.value.trim());
    name.value = "";
  } finally {
    pending.value = false;
  }
}

function handleDelete(category: TagCategory) {
  if (
    confirm(
      `Excluir a categoria "${category.name}"? Todas as tags dela também serão excluídas.`,
    )
  ) {
    deleteCategory(category.id);
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex gap-2 rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]">
      <UiInput
        v-model="name"
        placeholder="Nome da categoria (ex: Tipo, Disciplina)"
      />
      <UiButton :disabled="pending" @click="handleCreate">
        Criar categoria
      </UiButton>
    </div>

    <div class="space-y-2">
      <p v-if="categories.length === 0" class="text-sm text-slate-500">
        Nenhuma categoria ainda.
      </p>
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex items-center justify-between rounded-xl border border-accent-border/40 bg-surface p-3"
      >
        <span class="text-sm font-medium text-secondary">
          {{ category.name }}
        </span>
        <UiButton
          variant="destructive"
          size="sm"
          @click="handleDelete(category)"
        >
          Excluir
        </UiButton>
      </div>
    </div>
  </div>
</template>
