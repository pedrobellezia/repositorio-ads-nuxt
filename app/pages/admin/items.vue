<script setup lang="ts">
definePageMeta({ layout: "admin" });

const itemsAsyncData = usePublicItems();
const categoriesAsyncData = useTagCategories();
const profileAsyncData = useProfile();

const { data: items } = await itemsAsyncData;
const { data: categories } = await categoriesAsyncData;
const { data: profile } = await profileAsyncData;
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-heading font-bold text-secondary">Itens</h1>
      <AdminNewItemForm
        :categories="categories ?? []"
        :default-professor-name="profile?.display_name"
      />
    </div>

    <div class="space-y-3">
      <p v-if="!items || items.length === 0" class="text-sm text-slate-500">
        Nenhum item cadastrado ainda.
      </p>
      <AdminItemRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        :categories="categories ?? []"
      />
    </div>
  </div>
</template>
