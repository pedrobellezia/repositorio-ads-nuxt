<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ChevronRight } from "@lucide/vue";
import type { CategoryWithSubs, ItemWithTags, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

const props = defineProps<{
  items: ItemWithTags[];
  tags: Tag[];
  categories: CategoryWithSubs[];
}>();

// Filter state
const selectedCategoryId = ref<string | null>(null);
const selectedSubcategoryId = ref<string | null>(null);
const selectedTags = reactive(new Set<string>());

// Expanded state per category in the sidebar tree
const expandedCategories = reactive(new Set<string>());

function toggleCategory(catId: string) {
  if (expandedCategories.has(catId)) expandedCategories.delete(catId);
  else expandedCategories.add(catId);
}

function selectCategory(catId: string) {
  if (selectedCategoryId.value === catId && selectedSubcategoryId.value === null) {
    // deselect
    selectedCategoryId.value = null;
  } else {
    selectedCategoryId.value = catId;
    selectedSubcategoryId.value = null;
    expandedCategories.add(catId);
  }
}

function selectSubcategory(catId: string, subId: string) {
  if (selectedSubcategoryId.value === subId) {
    selectedSubcategoryId.value = null;
    selectedCategoryId.value = null;
  } else {
    selectedCategoryId.value = catId;
    selectedSubcategoryId.value = subId;
    expandedCategories.add(catId);
  }
}

function selectAll() {
  selectedCategoryId.value = null;
  selectedSubcategoryId.value = null;
}

function toggleTag(tagId: string) {
  if (selectedTags.has(tagId)) selectedTags.delete(tagId);
  else selectedTags.add(tagId);
}

function clearTags() {
  selectedTags.clear();
}

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    // Category filter
    if (selectedSubcategoryId.value) {
      if (item.subcategory_id !== selectedSubcategoryId.value) return false;
    } else if (selectedCategoryId.value) {
      if (item.subcategory?.category_id !== selectedCategoryId.value)
        return false;
    }

    // Tag filter
    if (selectedTags.size === 0) return true;
    return item.tags.some((tag) => selectedTags.has(tag.id));
  });
});

function categoryColor(catId: string): string {
  return (
    props.categories.find((c) => c.id === catId)?.color ?? "#13547a"
  );
}

function filterBtnClass(active: boolean, color?: string) {
  return cn(
    "w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors",
    active
      ? "text-white"
      : "text-secondary hover:bg-accent-border/20",
  );
}
</script>

<template>
  <div class="grid gap-6 md:grid-cols-[260px_1fr] md:items-start">
    <!-- Sidebar -->
    <aside
      class="space-y-5 rounded-2xl border border-accent-border/20 bg-surface p-5 shadow-[0_1rem_2rem_-0.5rem_rgba(3,46,71,0.1)] md:sticky md:top-6"
    >
      <!-- All items button -->
      <div>
        <h2 class="mb-2 font-heading text-sm font-semibold text-secondary">
          Categorias
        </h2>
        <button
          :class="
            cn(
              'w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors',
              !selectedCategoryId && !selectedSubcategoryId
                ? 'bg-secondary text-white'
                : 'text-secondary hover:bg-accent-border/20',
            )
          "
          @click="selectAll"
        >
          Todos os itens
        </button>

        <!-- Category tree -->
        <div class="mt-1 space-y-0.5">
          <div v-for="cat in categories" :key="cat.id">
            <!-- Category row -->
            <div class="flex items-center gap-1">
              <button
                class="flex flex-1 items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold transition-colors"
                :style="
                  selectedCategoryId === cat.id && !selectedSubcategoryId
                    ? { backgroundColor: cat.color, color: '#fff' }
                    : {}
                "
                :class="
                  selectedCategoryId === cat.id && !selectedSubcategoryId
                    ? ''
                    : 'text-secondary hover:bg-accent-border/20'
                "
                @click="selectCategory(cat.id)"
              >
                <span
                  class="h-2.5 w-2.5 shrink-0 rounded-full"
                  :style="{ backgroundColor: cat.color }"
                />
                {{ cat.name }}
              </button>
              <!-- Expand toggle -->
              <button
                v-if="cat.subcategories.length > 0"
                class="rounded p-0.5 text-slate-400 hover:text-secondary"
                @click="toggleCategory(cat.id)"
              >
                <ChevronRight
                  class="h-3.5 w-3.5 transition-transform"
                  :class="{ 'rotate-90': expandedCategories.has(cat.id) }"
                />
              </button>
            </div>

            <!-- Subcategories (collapsible) -->
            <div
              v-if="expandedCategories.has(cat.id) && cat.subcategories.length > 0"
              class="ml-4 mt-0.5 space-y-0.5 border-l-2 pl-3"
              :style="{ borderColor: cat.color + '66' }"
            >
              <button
                v-for="sub in cat.subcategories"
                :key="sub.id"
                class="w-full rounded-lg px-3 py-1 text-left text-xs font-medium transition-colors"
                :style="
                  selectedSubcategoryId === sub.id
                    ? { backgroundColor: cat.color + '22', color: cat.color }
                    : {}
                "
                :class="
                  selectedSubcategoryId === sub.id
                    ? 'font-semibold'
                    : 'text-secondary hover:bg-accent-border/20'
                "
                @click="selectSubcategory(cat.id, sub.id)"
              >
                {{ sub.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tags filter -->
      <div v-if="tags.length > 0" class="pt-1">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="flex items-center gap-1.5 font-heading text-sm font-semibold text-secondary">
            <span>Tags</span>
            <span
              v-if="selectedTags.size > 0"
              class="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-white"
            >
              {{ selectedTags.size }}
            </span>
          </h2>
          <button
            v-if="selectedTags.size > 0"
            type="button"
            class="text-[11px] font-medium text-slate-500 transition-colors hover:text-red-600"
            @click="clearTags"
          >
            Limpar
          </button>
        </div>

        <!-- Grouped tags with custom scrollbar when there are many -->
        <div class="custom-scrollbar max-h-48 overflow-y-auto pr-1">
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in tags"
              :key="tag.id"
              :class="
                cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
                  selectedTags.has(tag.id)
                    ? 'border-secondary bg-secondary text-white shadow-xs'
                    : 'border-accent-border/30 bg-section text-secondary hover:border-secondary/40 hover:bg-accent-border/20',
                )
              "
              @click="toggleTag(tag.id)"
            >
              <SiteTagIcon :icon="tag.icon" class="h-3 w-3" />
              <span>{{ tag.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Items column -->
    <div class="min-w-0">
      <!-- Horizontal tag slide bar on top of items -->
      <div
        v-if="tags.length > 0"
        class="custom-scrollbar mb-4 flex items-center gap-2 overflow-x-auto pb-2 pt-0.5"
      >
        <button
          type="button"
          :class="
            cn(
              'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all',
              selectedTags.size === 0
                ? 'border-secondary bg-secondary text-white shadow-xs'
                : 'border-accent-border/30 bg-surface text-secondary hover:bg-section',
            )
          "
          @click="clearTags"
        >
          Todas as tags
        </button>
        <button
          v-for="tag in tags"
          :key="tag.id"
          type="button"
          :class="
            cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all',
              selectedTags.has(tag.id)
                ? 'border-secondary bg-secondary text-white shadow-xs'
                : 'border-accent-border/30 bg-surface text-secondary hover:border-secondary/40 hover:bg-section',
            )
          "
          @click="toggleTag(tag.id)"
        >
          <SiteTagIcon :icon="tag.icon" class="h-3 w-3" />
          <span>{{ tag.name }}</span>
        </button>
      </div>

      <p v-if="filteredItems.length === 0" class="text-sm text-slate-500">
        Nenhum item encontrado com esses filtros.
      </p>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SiteItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
      </div>
    </div>
  </div>
</template>
