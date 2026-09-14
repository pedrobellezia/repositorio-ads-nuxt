<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { data: categories } = await useTagCategories();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-slate-900">Categorias de tag</h1>
      <p class="text-sm text-slate-500">
        Só administradores gerenciam categorias. Professores criam tags
        dentro delas em "Tags".
      </p>
    </div>
    <AdminCategoryManager :categories="categories ?? []" />
  </div>
</template>
