<script setup lang="ts">
import { computed } from "vue";

const { data: profile } = useProfile();
const isAdmin = computed(() => profile.value?.role === "admin");
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
    <header
      class="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-accent-border/30 pb-4"
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
        <nav class="flex gap-4 font-heading text-sm font-medium">
          <NuxtLink to="/admin/items" class="text-secondary hover:text-primary">
            Itens
          </NuxtLink>
          <NuxtLink to="/admin/tags" class="text-secondary hover:text-primary">
            Tags
          </NuxtLink>
          <template v-if="isAdmin">
            <NuxtLink
              to="/admin/categories"
              class="text-secondary hover:text-primary"
            >
              Categorias
            </NuxtLink>
            <NuxtLink
              to="/admin/professors"
              class="text-secondary hover:text-primary"
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
    </header>
    <slot />
  </div>
</template>
