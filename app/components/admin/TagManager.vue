<script setup lang="ts">
import { ref } from "vue";
import { TAG_ICON_OPTIONS } from "@/lib/tag-icons";
import type { SimilarTag, Tag } from "@/lib/types";

const props = defineProps<{
  tags: Tag[];
}>();

const { searchSimilarTags, createTag, deleteTag } = useTagActions();
const { confirmDialog } = useDialog();

const name = ref("");
const icon = ref(TAG_ICON_OPTIONS[0] ?? "code");
const similar = ref<SimilarTag[] | null>(null);
const pending = ref(false);

async function handleCreate() {
  if (!name.value.trim()) return;

  const results = await searchSimilarTags(name.value.trim());
  if (results.length > 0) {
    similar.value = results;
    return;
  }

  await confirmCreate();
}

async function confirmCreate() {
  similar.value = null;
  pending.value = true;
  try {
    await createTag(name.value.trim(), icon.value);
    name.value = "";
  } finally {
    pending.value = false;
  }
}

async function handleDeleteTag(tag: Tag) {
  const confirmed = await confirmDialog({
    title: "Excluir tag",
    description: `Excluir a tag "${tag.name}"? Essa ação não pode ser desfeita.`,
    confirmLabel: "Excluir",
    variant: "destructive",
  });
  if (confirmed) {
    await deleteTag(tag.id);
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-3 rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]">
      <h2 class="text-sm font-heading font-semibold text-secondary">Nova tag</h2>
      <div class="space-y-1.5">
        <UiLabel>Nome</UiLabel>
        <UiInput v-model="name" />
      </div>

      <div class="space-y-1.5">
        <UiLabel>Ícone</UiLabel>
        <UiIconPicker v-model="icon" />
      </div>

      <UiButton :disabled="pending" @click="handleCreate">
        Criar tag
      </UiButton>
    </div>

    <div class="rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]">
      <p v-if="tags.length === 0" class="text-xs text-slate-500">
        Nenhuma tag ainda.
      </p>
      <div v-else class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag.id"
          class="inline-flex items-center gap-2 rounded-full border border-transparent bg-section py-1 pl-3 pr-1 text-sm text-secondary"
        >
          <SiteTagIcon :icon="tag.icon" class="h-3.5 w-3.5" />
          {{ tag.name }}
          <button
            class="rounded-full px-1.5 text-slate-400 hover:bg-white hover:text-red-600"
            @click="handleDeleteTag(tag)"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <UiModal :open="similar !== null" @update:open="(v) => !v && (similar = null)">
      <template #title>Tags parecidas encontradas</template>
      <template #description>
        Já existem tags parecidas com "{{ name }}". Tem certeza que quer
        criar mesmo assim?
      </template>

      <div class="flex flex-wrap gap-2">
        <UiBadge v-for="s in similar" :key="s.id" variant="outline">
          {{ s.name }} ({{ Math.round(s.similarity * 100) }}%)
        </UiBadge>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <UiButton variant="ghost" @click="similar = null">Cancelar</UiButton>
        <UiButton @click="confirmCreate">Criar mesmo assim</UiButton>
      </div>
    </UiModal>
  </div>
</template>
