<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ layout: "admin" });

const categoriesAsyncData = useTagCategories();
const profileAsyncData = useProfile();

const { data: categories } = await categoriesAsyncData;
const { data: profile } = await profileAsyncData;

const isAdmin = computed(() => profile.value?.role === "admin");
</script>

<template>
  <div class="space-y-8">
    <div v-if="isAdmin" class="space-y-3">
      <div>
        <h1 class="font-heading text-xl font-bold text-secondary">
          Categorias
        </h1>
        <p class="text-sm text-slate-500">
          Agrupam as tags (ex: "Tipo"). Só administradores criam/excluem
          categorias.
        </p>
      </div>
      <AdminCategoryManager :categories="categories ?? []" />
    </div>

    <div class="space-y-3">
      <h1 class="font-heading text-xl font-bold text-secondary">Tags</h1>
      <p
        v-if="!categories || categories.length === 0"
        class="text-sm text-slate-500"
      >
        Nenhuma categoria de tag existe ainda — peça para o admin criar uma
        acima antes de cadastrar tags.
      </p>
      <AdminTagManager v-else :categories="categories" />
    </div>
  </div>
</template>
