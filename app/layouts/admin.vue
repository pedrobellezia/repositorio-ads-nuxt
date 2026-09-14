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
      <div
        class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-3"
      >
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1.5">
            <img
              src="/fmp-logo.png"
              alt="FMP — Faculdade Municipal de Palhoça"
              width="150"
              height="30"
              class="h-6 w-auto"
            />
          </NuxtLink>
          <nav class="flex gap-1 font-heading text-sm font-medium">
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
        <div class="flex items-center gap-3 text-sm text-white/80">
          <span>
            {{ profile?.display_name ?? "Sem nome" }} ·
            {{ isAdmin ? "admin" : "professor" }}
          </span>
          <AdminSignOutButton class="text-white hover:bg-white/15 hover:text-white" />
        </div>
      </div>
    </header>
    <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <slot />
    </div>
  </div>
</template>
