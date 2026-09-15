<script setup lang="ts">
import { PHASE_LABELS, PHASES } from "@/lib/types";
import type { Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

defineProps<{
  tags: Tag[];
  hasExistingFile?: boolean;
  hideProfessorField?: boolean;
}>();

const emit = defineEmits<{ "file-change": [file: File | null] }>();

const form = defineModel<{
  name: string;
  description: string;
  phase: string;
  professor_name: string;
  link_url: string;
}>("form", { required: true });

const tagIds = defineModel<Set<string>>("tagIds", { required: true });

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  emit("file-change", input.files?.[0] ?? null);
}

function toggleTag(tagId: string) {
  const next = new Set(tagIds.value);
  if (next.has(tagId)) next.delete(tagId);
  else next.add(tagId);
  tagIds.value = next;
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="space-y-1.5 sm:col-span-2">
      <UiLabel for="name">Nome</UiLabel>
      <UiInput id="name" v-model="form.name" required />
    </div>

    <div class="space-y-1.5 sm:col-span-2">
      <UiLabel for="description">Descrição</UiLabel>
      <UiTextarea id="description" v-model="form.description" />
    </div>

    <div class="space-y-1.5">
      <UiLabel for="phase">Fase</UiLabel>
      <select
        id="phase"
        v-model="form.phase"
        class="flex h-10 w-full rounded-lg border border-accent-border/60 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option v-for="p in PHASES" :key="p" :value="p">
          {{ PHASE_LABELS[p] }}
        </option>
      </select>
    </div>

    <div v-if="!hideProfessorField" class="space-y-1.5">
      <UiLabel for="professor_name">Professor(a)</UiLabel>
      <UiInput
        id="professor_name"
        v-model="form.professor_name"
        placeholder="Deixe em branco para item geral"
      />
    </div>

    <div class="space-y-1.5">
      <UiLabel for="link_url">Link externo</UiLabel>
      <UiInput
        id="link_url"
        v-model="form.link_url"
        type="url"
        placeholder="https://..."
      />
    </div>

    <div class="space-y-1.5">
      <UiLabel for="file">
        Arquivo {{ hasExistingFile ? "(substituir)" : "(máx. 10MB)" }}
      </UiLabel>
      <input
        id="file"
        type="file"
        accept="*/*"
        class="flex h-10 w-full rounded-lg border border-accent-border/60 bg-white px-3 py-1.5 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-section file:px-3 file:py-1 file:text-xs file:font-semibold file:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @change="onFileChange"
      />
    </div>

    <div class="space-y-1.5 sm:col-span-2">
      <UiLabel>Tags</UiLabel>
      <p v-if="tags.length === 0" class="text-xs text-slate-500">
        Nenhuma tag cadastrada ainda.
      </p>
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="tag in tags"
          :key="tag.id"
          type="button"
          :class="
            cn(
              'inline-flex items-center gap-1.5 rounded-full border border-accent-border/50 px-3 py-1 text-xs font-medium transition-colors',
              tagIds.has(tag.id)
                ? 'border-secondary bg-secondary text-white hover:bg-primary'
                : 'bg-white text-secondary hover:bg-section',
            )
          "
          @click="toggleTag(tag.id)"
        >
          <SiteTagIcon :icon="tag.icon" class="h-3 w-3" />
          {{ tag.name }}
        </button>
      </div>
    </div>
  </div>
</template>
