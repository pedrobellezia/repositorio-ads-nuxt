<script setup lang="ts">
import { Download, FileText } from "@lucide/vue";
import type { ItemWithTags } from "@/lib/types";
import { getPublicFileUrl } from "@/lib/storage";

defineProps<{
  item: ItemWithTags;
}>();
</script>

<template>
  <div
    class="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-accent-border/20 bg-surface p-5 shadow-[0_1rem_2rem_-0.5rem_rgba(3,46,71,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1.5rem_3rem_-0.75rem_rgba(3,46,71,0.2)]"
  >
    <!-- Category color strip -->
    <span
      class="absolute inset-x-0 top-0 h-1.5"
      :style="{ backgroundColor: item.subcategory?.category.color ?? '#13547a' }"
      aria-hidden="true"
    />

    <!-- Subcategory / Category badge row -->
    <div class="flex flex-col gap-1.5">
      <div v-if="item.subcategory" class="flex items-center gap-1.5 flex-wrap">
        <span
          class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-2xs"
          :style="{ backgroundColor: item.subcategory.category.color ?? '#13547a' }"
        >
          <span class="font-normal opacity-85">{{ item.subcategory.category.name }} ›</span>
          <span>{{ item.subcategory.name }}</span>
        </span>
      </div>

      <!-- Item title with full width and clear hierarchy -->
      <h3 class="font-heading text-base font-semibold leading-snug text-secondary">
        {{ item.name }}
      </h3>
    </div>

    <p v-if="item.description" class="line-clamp-3 text-sm leading-relaxed text-slate-600">
      {{ item.description }}
    </p>

    <p v-if="item.professor_name" class="text-xs font-medium text-slate-500">
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
