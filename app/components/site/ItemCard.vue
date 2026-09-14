<script setup lang="ts">
import { Download, FileText } from "@lucide/vue";
import { PHASE_LABELS, type ItemWithTags } from "@/lib/types";
import { PHASE_COLORS } from "@/lib/phase-colors";
import { getPublicFileUrl } from "@/lib/storage";

defineProps<{
  item: ItemWithTags;
}>();
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border border-accent-border/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-heading font-semibold text-secondary">{{ item.name }}</h3>
      <span
        class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
        :style="{ backgroundColor: PHASE_COLORS[item.phase] }"
      >
        {{ PHASE_LABELS[item.phase] }}
      </span>
    </div>

    <p v-if="item.description" class="text-sm text-slate-600">
      {{ item.description }}
    </p>

    <p v-if="item.professor_name" class="text-xs text-slate-500">
      Professor(a): {{ item.professor_name }}
    </p>

    <div v-if="item.tags.length > 0" class="flex flex-wrap gap-1.5">
      <UiBadge v-for="tag in item.tags" :key="tag.id">
        <SiteTagIcon :icon="tag.icon" class="h-3 w-3" />
        {{ tag.name }}
      </UiBadge>
    </div>

    <div class="mt-auto flex flex-wrap gap-2 pt-2">
      <a
        v-if="item.link_url"
        :href="item.link_url"
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-heading text-sm font-semibold text-white hover:bg-primary"
      >
        <Download class="h-3.5 w-3.5" />
        Link
      </a>
      <a
        v-if="item.file_path"
        :href="getPublicFileUrl(item.file_path)"
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full border-2 border-secondary px-3 py-1.5 font-heading text-sm font-semibold text-secondary hover:bg-secondary hover:text-white"
      >
        <FileText class="h-3.5 w-3.5" />
        Arquivo
      </a>
    </div>
  </div>
</template>
