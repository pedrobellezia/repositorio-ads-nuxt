<script setup lang="ts">
const itemsAsyncData = usePublicItems();
const categoriesAsyncData = useTagCategories();

const { data: items } = await itemsAsyncData;
const { data: categories } = await categoriesAsyncData;
</script>

<template>
  <div class="flex-1">
    <header
      class="px-4 pb-10 pt-6 text-white"
      style="
        background-image: linear-gradient(
          15deg,
          rgba(19, 84, 122, 0.7) 0%,
          #13547a 100%
        );
      "
    >
      <div class="mx-auto flex w-full max-w-6xl justify-end">
        <NuxtLink
          to="/login"
          class="shrink-0 rounded-full border-2 border-white/70 px-4 py-1.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-white hover:text-secondary"
        >
          Área do professor
        </NuxtLink>
      </div>
      <div class="mx-auto mt-4 flex w-full max-w-6xl flex-col items-center gap-4 text-center">
        <div class="rounded-2xl bg-white px-6 py-4 shadow-lg">
          <img
            src="/ads-logo-color.png"
            alt="ADS — Análise e Desenvolvimento de Sistemas"
            width="450"
            height="125"
            class="h-14 w-auto sm:h-20"
          />
        </div>
        <h1 class="font-heading text-4xl font-bold sm:text-5xl">
          Repositório Acadêmico
        </h1>
        <p class="max-w-2xl text-sm text-white/85 sm:text-base">
          Links e documentos do curso de ADS organizados por fase e por
          tags, centralizados para estudantes e professores.
        </p>
      </div>
    </header>

    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <SiteItemBrowser :items="items ?? []" :categories="categories ?? []" />
    </div>
  </div>
</template>
