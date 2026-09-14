<script setup lang="ts">
const itemsAsyncData = usePublicItems();
const categoriesAsyncData = useTagCategories();

const { data: items } = await itemsAsyncData;
const { data: categories } = await categoriesAsyncData;
</script>

<template>
  <div class="flex-1">
    <header
      class="px-4 py-10 text-white"
      style="
        background-image: linear-gradient(
          15deg,
          rgba(19, 84, 122, 0.7) 0%,
          #13547a 100%
        );
      "
    >
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div class="rounded-lg bg-white/95 px-3 py-1.5">
          <img
            src="/fmp-logo.png"
            alt="FMP — Faculdade Municipal de Palhoça"
            width="220"
            height="44"
            class="h-8 w-auto"
          />
        </div>
        <NuxtLink
          to="/login"
          class="shrink-0 rounded-full border-2 border-white/70 px-4 py-1.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-white hover:text-secondary"
        >
          Área do professor
        </NuxtLink>
      </div>
      <div class="mx-auto mt-8 w-full max-w-6xl">
        <h1 class="text-3xl font-bold sm:text-4xl">
          Repositório Acadêmico — ADS
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-white/85">
          Links e documentos organizados por fase e por tags do curso,
          centralizados para estudantes e professores.
        </p>
      </div>
    </header>

    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <SiteItemBrowser :items="items ?? []" :categories="categories ?? []" />
    </div>
  </div>
</template>
