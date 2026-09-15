<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { TAG_ICON_COMMON, searchIcons } from "@/lib/tag-icons";
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();

const model = defineModel<string>({ required: true });

const query = ref("");
const searching = ref(false);
const searchResults = ref<string[]>([]);

watch(query, async (value) => {
  const q = value.trim();
  if (!q) {
    searchResults.value = [];
    searching.value = false;
    return;
  }

  searching.value = true;
  const results = await searchIcons(q);
  // Ignora resultado se o texto já mudou enquanto a busca carregava.
  if (query.value.trim() === q) {
    searchResults.value = results.map((r) => r.key);
    searching.value = false;
  }
});

const options = computed(() =>
  query.value.trim() ? searchResults.value : TAG_ICON_COMMON,
);
</script>

<template>
  <div :class="cn('space-y-2', $props.class)">
    <div class="flex items-center justify-between gap-2">
      <UiInput
        v-model="query"
        type="search"
        placeholder="Buscar outro ícone..."
      />
      <a
        href="https://lucide.dev/icons/"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 text-xs text-secondary underline underline-offset-2 hover:text-secondary/80"
      >
        Ver todos os ícones
      </a>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="opt in options"
        :key="opt"
        type="button"
        :title="opt"
        :aria-label="opt"
        :class="
          cn(
            'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
            model === opt
              ? 'border-secondary bg-secondary text-white'
              : 'border-accent-border/60 bg-white text-secondary hover:bg-section',
          )
        "
        @click="model = opt"
      >
        <SiteTagIcon :icon="opt" class="h-4 w-4" />
      </button>

      <p
        v-if="query.trim() && !searching && options.length === 0"
        class="text-sm text-slate-500"
      >
        Nenhum ícone encontrado.
      </p>
    </div>
  </div>
</template>
