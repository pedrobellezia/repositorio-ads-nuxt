<script setup lang="ts">
import { ref } from "vue";
import type { CategoryWithSubs } from "@/lib/types";

defineProps<{
  categories: CategoryWithSubs[];
}>();

const {
  createCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
} = useCategoryActions();

const { confirmDialog, alertDialog } = useDialog();

// ── New category form ────────────────────────────────────────
const newCatName = ref("");
const newCatColor = ref("#13547a");
const pendingCat = ref(false);
const catError = ref<string | null>(null);

async function handleCreateCategory() {
  if (!newCatName.value.trim()) return;
  catError.value = null;
  pendingCat.value = true;
  try {
    await createCategory(newCatName.value, newCatColor.value);
    newCatName.value = "";
    newCatColor.value = "#13547a";
  } catch (err: unknown) {
    catError.value =
      err instanceof Error ? err.message : "Erro ao criar categoria.";
  } finally {
    pendingCat.value = false;
  }
}

async function handleDeleteCategory(cat: CategoryWithSubs) {
  const confirmed = await confirmDialog({
    title: "Excluir categoria",
    description: `Excluir a categoria "${cat.name}" e todas as suas subcategorias? Essa ação não pode ser desfeita.`,
    confirmLabel: "Excluir",
    variant: "destructive",
  });
  if (!confirmed) return;
  try {
    await deleteCategory(cat.id);
  } catch (err: unknown) {
    await alertDialog({
      title: "Erro",
      description: err instanceof Error ? err.message : "Erro ao excluir categoria.",
    });
  }
}

// ── New subcategory form (per category) ─────────────────────
const newSubName = ref<Record<string, string>>({});
const pendingSub = ref<Record<string, boolean>>({});
const subError = ref<Record<string, string | null>>({});

async function handleCreateSubcategory(categoryId: string) {
  const name = newSubName.value[categoryId]?.trim();
  if (!name) return;
  subError.value[categoryId] = null;
  pendingSub.value[categoryId] = true;
  try {
    await createSubcategory(categoryId, name);
    newSubName.value[categoryId] = "";
  } catch (err: unknown) {
    subError.value[categoryId] =
      err instanceof Error ? err.message : "Erro ao criar subcategoria.";
  } finally {
    pendingSub.value[categoryId] = false;
  }
}

async function handleDeleteSubcategory(subId: string, subName: string) {
  const confirmed = await confirmDialog({
    title: "Excluir subcategoria",
    description: `Excluir a subcategoria "${subName}"? Essa ação não pode ser desfeita.`,
    confirmLabel: "Excluir",
    variant: "destructive",
  });
  if (!confirmed) return;
  try {
    await deleteSubcategory(subId);
  } catch (err: unknown) {
    await alertDialog({
      title: "Erro",
      description: err instanceof Error ? err.message : "Erro ao excluir subcategoria.",
    });
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Create category -->
    <div
      class="space-y-3 rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]"
    >
      <h2 class="text-sm font-heading font-semibold text-secondary">
        Nova categoria
      </h2>
      <div class="flex flex-wrap gap-3">
        <div class="min-w-0 flex-1 space-y-1.5">
          <UiLabel for="new-cat-name">Nome</UiLabel>
          <UiInput
            id="new-cat-name"
            v-model="newCatName"
            placeholder="Ex: Ferramentas"
          />
        </div>
        <div class="space-y-1.5">
          <UiLabel for="new-cat-color">Cor</UiLabel>
          <div class="flex items-center gap-2">
            <input
              id="new-cat-color"
              v-model="newCatColor"
              type="color"
              class="h-10 w-14 cursor-pointer rounded-lg border border-accent-border/60 bg-white p-1"
            />
            <span class="font-mono text-xs text-slate-500">{{ newCatColor }}</span>
          </div>
        </div>
      </div>
      <p v-if="catError" class="text-sm text-red-600">{{ catError }}</p>
      <UiButton :disabled="pendingCat" @click="handleCreateCategory">
        Criar categoria
      </UiButton>
    </div>

    <!-- Existing categories -->
    <div
      v-for="cat in categories"
      :key="cat.id"
      class="rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]"
    >
      <!-- Category header -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: cat.color }"
          />
          <h2 class="font-heading font-semibold text-secondary">
            {{ cat.name }}
          </h2>
        </div>
        <button
          class="rounded-full px-2 py-0.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600"
          @click="handleDeleteCategory(cat)"
        >
          Excluir categoria
        </button>
      </div>

      <!-- Subcategories list -->
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="sub in cat.subcategories"
          :key="sub.id"
          class="inline-flex items-center gap-2 rounded-full border border-transparent bg-section py-1 pl-3 pr-1 text-sm text-secondary"
        >
          {{ sub.name }}
          <button
            class="rounded-full px-1.5 text-slate-400 hover:bg-white hover:text-red-600"
            @click="handleDeleteSubcategory(sub.id, sub.name)"
          >
            ×
          </button>
        </span>
        <p v-if="cat.subcategories.length === 0" class="text-xs text-slate-400">
          Nenhuma subcategoria ainda.
        </p>
      </div>

      <!-- Add subcategory inline -->
      <div class="mt-3 flex items-center gap-2">
        <UiInput
          :id="`new-sub-${cat.id}`"
          v-model="newSubName[cat.id]"
          class="h-8 text-xs"
          placeholder="Nova subcategoria..."
          @keydown.enter.prevent="handleCreateSubcategory(cat.id)"
        />
        <UiButton
          size="sm"
          :disabled="pendingSub[cat.id]"
          @click="handleCreateSubcategory(cat.id)"
        >
          Adicionar
        </UiButton>
      </div>
      <p v-if="subError[cat.id]" class="mt-1 text-xs text-red-600">
        {{ subError[cat.id] }}
      </p>
    </div>

    <p v-if="categories.length === 0" class="text-xs text-slate-500">
      Nenhuma categoria criada ainda.
    </p>
  </div>
</template>
