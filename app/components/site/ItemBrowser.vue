<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { PHASE_LABELS, PHASES, type Phase } from "@/lib/types";
import type { CategoryWithTags, ItemWithTags } from "@/lib/types";
import { PHASE_COLORS } from "@/lib/phase-colors";
import { cn } from "@/lib/utils";

const props = defineProps<{
  items: ItemWithTags[];
  categories: CategoryWithTags[];
}>();

const phase = ref<Phase | "todas">("todas");
const selectedTags = reactive(new Set<string>());

function toggleTag(tagId: string) {
  if (selectedTags.has(tagId)) selectedTags.delete(tagId);
  else selectedTags.add(tagId);
}

function clearTags() {
  selectedTags.clear();
}

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    if (phase.value !== "todas" && item.phase !== phase.value) return false;

    for (const category of props.categories) {
      const selectedInCategory = category.tags
        .map((t) => t.id)
        .filter((id) => selectedTags.has(id));

      if (selectedInCategory.length === 0) continue;

      const hasMatch = item.tags.some((tag) =>
        selectedInCategory.includes(tag.id),
      );
      if (!hasMatch) return false;
    }

    return true;
  });
});

function phaseButtonClass(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    active
      ? "border-secondary bg-secondary text-white"
      : "border-transparent bg-section text-secondary hover:bg-accent-border/20",
  );
}
</script>

<template>
  <div class="grid gap-6 md:grid-cols-[260px_1fr] md:items-start">
    <aside
      class="space-y-6 rounded-2xl border border-accent-border/20 bg-surface p-5 shadow-[0_1rem_2rem_-0.5rem_rgba(3,46,71,0.1)] md:sticky md:top-6"
    >
      <div>
        <h2 class="mb-2 font-heading text-sm font-semibold text-secondary">
          Fase
        </h2>
        <div class="flex flex-wrap gap-1.5 md:flex-col">
          <button
            :class="phaseButtonClass(phase === 'todas')"
            @click="phase = 'todas'"
          >
            Todas
          </button>
          <button
            v-for="p in PHASES"
            :key="p"
            :class="phaseButtonClass(phase === p)"
            :style="
              phase === p
                ? { backgroundColor: PHASE_COLORS[p], borderColor: PHASE_COLORS[p] }
                : undefined
            "
            @click="phase = p"
          >
            {{ PHASE_LABELS[p] }}
          </button>
        </div>
      </div>

      <div v-for="category in categories" :key="category.id">
        <h2 class="mb-2 font-heading text-sm font-semibold text-secondary">
          {{ category.name }}
        </h2>
        <div class="flex flex-wrap gap-1.5 md:flex-col md:items-start">
          <button
            v-for="tag in category.tags"
            :key="tag.id"
            :class="
              cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                selectedTags.has(tag.id)
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-transparent bg-section text-secondary hover:bg-accent-border/20',
              )
            "
            @click="toggleTag(tag.id)"
          >
            <SiteTagIcon :icon="tag.icon" class="h-3 w-3" />
            {{ tag.name }}
          </button>
        </div>
      </div>

      <UiButton v-if="selectedTags.size > 0" variant="ghost" size="sm" @click="clearTags">
        Limpar tags
      </UiButton>
    </aside>

    <div>
      <p v-if="filteredItems.length === 0" class="text-sm text-slate-500">
        Nenhum item encontrado com esses filtros.
      </p>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SiteItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
      </div>
    </div>
  </div>
</template>
