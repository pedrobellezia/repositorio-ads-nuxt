<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

const { data: profile } = useProfile();
const isAdmin = computed(() => profile.value?.role === "admin");

const route = useRoute();

function navLinkClass(path: string) {
  const active = route.path.startsWith(path);
  return cn(
    "rounded-full px-3 py-1.5 transition-colors",
    active
      ? "bg-white text-secondary hover:bg-white hover:text-secondary"
      : "text-white/85 hover:bg-white/15 hover:text-white",
  );
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col">
    <header
      class="shadow-md"
      style="
        background-image: linear-gradient(
          15deg,
          rgba(19, 84, 122, 0.7) 0%,
          #13547a 100%
        );
      "
    >
      <div class="mx-auto w-full max-w-3xl px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm"
          >
            <img
              src="/fmp-logo.png"
              alt="FMP — Faculdade Municipal de Palhoça"
              width="150"
              height="30"
              class="h-8 w-auto"
            />
          </NuxtLink>
          <div class="flex items-center gap-3 text-sm text-white/80">
            <span>
              {{ profile?.display_name ?? "Sem nome" }} ·
              {{ isAdmin ? "admin" : "professor" }}
            </span>
            <AdminSignOutButton class="text-white hover:bg-white/15 hover:text-white" />
          </div>
        </div>

        <nav class="mt-4 flex flex-wrap gap-1 font-heading text-sm font-medium">
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
        </nav>
      </div>
    </header>
    <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <slot />
    </div>
  </div>
</template>
