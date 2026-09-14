<script setup lang="ts">
import { computed } from "vue";

const { data: profile } = useProfile();
const isAdmin = computed(() => profile.value?.role === "admin");
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col">
    <header class="border-b border-accent-border/20 bg-surface shadow-sm">
      <div
        class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-4"
      >
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img
              src="/fmp-logo.png"
              alt="FMP — Faculdade Municipal de Palhoça"
              width="150"
              height="30"
              class="h-6 w-auto"
            />
          </NuxtLink>
          <nav class="flex gap-1 font-heading text-sm font-medium">
            <NuxtLink
              to="/admin/items"
              class="rounded-full px-3 py-1.5 text-secondary transition-colors hover:bg-section"
              active-class="bg-secondary text-white hover:bg-secondary"
            >
              Itens
            </NuxtLink>
            <NuxtLink
              to="/admin/tags"
              class="rounded-full px-3 py-1.5 text-secondary transition-colors hover:bg-section"
              active-class="bg-secondary text-white hover:bg-secondary"
            >
              Tags
            </NuxtLink>
            <template v-if="isAdmin">
              <NuxtLink
                to="/admin/categories"
                class="rounded-full px-3 py-1.5 text-secondary transition-colors hover:bg-section"
                active-class="bg-secondary text-white hover:bg-secondary"
              >
                Categorias
              </NuxtLink>
              <NuxtLink
                to="/admin/professors"
                class="rounded-full px-3 py-1.5 text-secondary transition-colors hover:bg-section"
                active-class="bg-secondary text-white hover:bg-secondary"
              >
                Professores
              </NuxtLink>
            </template>
          </nav>
        </div>
        <div class="flex items-center gap-3 text-sm text-slate-500">
          <span>
            {{ profile?.display_name ?? "Sem nome" }} ·
            {{ isAdmin ? "admin" : "professor" }}
          </span>
          <AdminSignOutButton />
        </div>
      </div>
    </header>
    <div class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <slot />
    </div>
  </div>
</template>
