<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue";
import { computed } from "vue";
import { cn } from "@/lib/utils";

const { data: profile } = useProfile();
const isAdmin = computed(() => profile.value?.role === "admin");

const route = useRoute();

function navLinkClass(path: string) {
  const active = route.path.startsWith(path);
  return cn(
    "rounded-full border px-3 py-1.5 transition-colors",
    active
      ? "border-secondary bg-secondary text-white"
      : "border-transparent bg-section text-secondary hover:bg-accent-border/20",
  );
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col">
    <header
      class="px-4 pb-16 pt-6 text-white"
      style="
        background-image: linear-gradient(
          15deg,
          rgba(19, 84, 122, 0.7) 0%,
          #13547a 100%
        );
      "
    >
      <div class="mx-auto flex w-full max-w-3xl items-center justify-between">
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft class="h-4 w-4" />
          Início
        </NuxtLink>
        <AdminUserMenu :display-name="profile?.display_name ?? 'Sem nome'" />
      </div>
      <div class="mx-auto mt-2 flex w-full max-w-3xl flex-col items-center gap-3 text-center">
        <img
          src="/ads-logo-color.png"
          alt="ADS — Análise e Desenvolvimento de Sistemas"
          width="450"
          height="125"
          class="h-16 w-auto drop-shadow-md sm:h-24"
        />
        <h1 class="font-heading text-4xl font-bold sm:text-5xl">
          Repositório Acadêmico
        </h1>
        <p class="max-w-2xl text-sm text-white/85 sm:text-base">
          Links e documentos do curso de ADS organizados por categorias e por
          tags, centralizados para estudantes e professores.
        </p>
      </div>
    </header>

    <nav class="mx-auto -mt-10 w-full max-w-3xl px-4 font-heading text-sm font-medium">
      <div class="flex flex-wrap gap-1.5 rounded-2xl border border-accent-border/40 bg-surface p-2 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]">
        <NuxtLink to="/items" :class="navLinkClass('/items')">
          Itens
        </NuxtLink>
        <NuxtLink to="/tags" :class="navLinkClass('/tags')">
          Tags &amp; Categorias
        </NuxtLink>
        <NuxtLink
          v-if="isAdmin"
          to="/professores"
          :class="navLinkClass('/professores')"
        >
          Professores
        </NuxtLink>
      </div>
    </nav>

    <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <slot />
    </div>
  </div>
</template>
