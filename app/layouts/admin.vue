<script setup lang="ts">
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
      class="px-4 pb-14 pt-4 text-white"
      style="
        background-image: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 70%,
            var(--background) 100%
          ),
          linear-gradient(15deg, rgba(19, 84, 122, 0.7) 0%, #13547a 100%);
      "
    >
      <div class="mx-auto flex w-full max-w-3xl justify-end gap-3 text-sm text-white/80">
        <span>
          {{ profile?.display_name ?? "Sem nome" }} ·
          {{ isAdmin ? "admin" : "professor" }}
        </span>
        <AdminSignOutButton class="text-white hover:bg-white/15 hover:text-white" />
      </div>
      <div class="mx-auto mt-2 flex w-full max-w-3xl flex-col items-center gap-3 text-center">
        <NuxtLink to="/">
          <img
            src="/ads-logo-color.png"
            alt="ADS — Análise e Desenvolvimento de Sistemas"
            width="450"
            height="125"
            class="h-12 w-auto drop-shadow-md sm:h-14"
          />
        </NuxtLink>
        <h1 class="font-heading text-2xl font-bold sm:text-3xl">
          Repositório Acadêmico
        </h1>
      </div>
    </header>

    <nav class="mx-auto -mt-10 w-full max-w-3xl px-4 font-heading text-sm font-medium">
      <div class="flex flex-wrap gap-1.5 rounded-2xl border border-accent-border/40 bg-surface p-2 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]">
        <NuxtLink to="/admin/items" :class="navLinkClass('/admin/items')">
          Itens
        </NuxtLink>
        <NuxtLink to="/admin/tags" :class="navLinkClass('/admin/tags')">
          Tags
        </NuxtLink>
        <template v-if="isAdmin">
          <NuxtLink
            to="/admin/categories"
            :class="navLinkClass('/admin/categories')"
          >
            Categorias
          </NuxtLink>
          <NuxtLink
            to="/admin/professors"
            :class="navLinkClass('/admin/professors')"
          >
            Professores
          </NuxtLink>
        </template>
      </div>
    </nav>

    <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <slot />
    </div>
  </div>
</template>
