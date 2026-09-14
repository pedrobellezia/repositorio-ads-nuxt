<script setup lang="ts">
import { computed } from "vue";

const { data: profile } = useProfile();
const isAdmin = computed(() => profile.value?.role === "admin");
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
            <NuxtLink
              to="/admin/items"
              class="rounded-full px-3 py-1.5 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              active-class="bg-white text-secondary hover:bg-white hover:text-secondary"
            >
              Itens
            </NuxtLink>
            <NuxtLink
              to="/admin/tags"
              class="rounded-full px-3 py-1.5 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              active-class="bg-white text-secondary hover:bg-white hover:text-secondary"
            >
              Tags
            </NuxtLink>
            <template v-if="isAdmin">
              <NuxtLink
                to="/admin/categories"
                class="rounded-full px-3 py-1.5 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
                active-class="bg-white text-secondary hover:bg-white hover:text-secondary"
              >
                Categorias
              </NuxtLink>
              <NuxtLink
                to="/admin/professors"
                class="rounded-full px-3 py-1.5 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
                active-class="bg-white text-secondary hover:bg-white hover:text-secondary"
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
