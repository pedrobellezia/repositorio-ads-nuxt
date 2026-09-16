<script setup lang="ts">
import { ChevronDown, DoorOpen, Settings } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

defineProps<{
  displayName: string;
  roleLabel: string;
}>();

const router = useRouter();
const supabase = useSupabaseClient();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
}

function handleClickOutside(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

async function handleSignOut() {
  await supabase.auth.signOut();
  await router.push("/");
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/15 hover:text-white"
      @click="toggle"
    >
      <span>{{ displayName }} · {{ roleLabel }}</span>
      <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': open }" />
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-accent-border/40 bg-surface py-1 text-left shadow-lg"
    >
      <NuxtLink
        to="/conta"
        class="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-section"
        @click="open = false"
      >
        <Settings class="h-4 w-4" />
        Minha conta
      </NuxtLink>
      <button
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        @click="handleSignOut"
      >
        <DoorOpen class="h-4 w-4" />
        Sair
      </button>
    </div>
  </div>
</template>
