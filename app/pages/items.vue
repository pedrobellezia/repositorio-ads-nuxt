<script setup lang="ts">
definePageMeta({ layout: "admin" });

const itemsAsyncData = usePublicItems();
const tagsAsyncData = useTags();
const profileAsyncData = useProfile();

const { data: items } = await itemsAsyncData;
const { data: tags } = await tagsAsyncData;
const { data: profile } = await profileAsyncData;
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-heading font-bold text-secondary">Itens</h1>
      <AdminNewItemForm
        :tags="tags ?? []"
        :professor-name="profile?.role === 'professor' ? profile.display_name : null"
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
        :tags="tags ?? []"
      />
    </div>
  </div>
</template>
