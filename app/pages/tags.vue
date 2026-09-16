<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { data: tags } = await useTags();
const { data: categories } = await useCategories();
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-3">
      <h1 class="font-heading text-xl font-bold text-secondary">Tags</h1>
      <AdminTagManager :tags="tags ?? []" />
    </div>

    <div class="space-y-3">
      <h2 class="font-heading text-xl font-bold text-secondary">Categorias</h2>
      <AdminCategoryManager :categories="categories ?? []" />
    </div>
  </div>
</template>
