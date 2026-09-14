<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { data: categories } = await useTagCategories();
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold text-slate-900">Tags</h1>
    <p v-if="!categories || categories.length === 0" class="text-sm text-slate-500">
      Nenhuma categoria de tag existe ainda — peça para o admin criar uma
      em "Categorias" antes de cadastrar tags.
    </p>
    <AdminTagManager v-else :categories="categories" />
  </div>
</template>
