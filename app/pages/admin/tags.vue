<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { data: tags } = await useTags();
</script>

<template>
  <div class="space-y-3">
    <h1 class="font-heading text-xl font-bold text-secondary">Tags</h1>
    <AdminTagManager :tags="tags ?? []" />
  </div>
</template>
