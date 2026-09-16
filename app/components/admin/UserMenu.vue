<script setup lang="ts">
import { DoorOpen, ChevronDown, KeyRound } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

defineProps<{
  displayName: string;
}>();

const router = useRouter();
const supabase = useSupabaseClient();
const { updateDisplayName } = useAccountActions();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const newName = ref("");
const savingName = ref(false);
const savingNameError = ref<string | null>(null);
const passwordModalOpen = ref(false);

function closeMenu() {
  open.value = false;
  newName.value = "";
  savingNameError.value = null;
}

function toggle() {
  if (open.value) {
    closeMenu();
  } else {
    open.value = true;
  }
}

function handleClickOutside(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) {
    closeMenu();
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

async function handleSaveName() {
  if (!newName.value.trim()) return;

  savingName.value = true;
  savingNameError.value = null;
  try {
    await updateDisplayName(newName.value);
    closeMenu();
  } catch (err: unknown) {
    savingNameError.value =
      err instanceof Error ? err.message : "Erro ao salvar nome.";
  } finally {
    savingName.value = false;
  }
}

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
      <span>{{ displayName }}</span>
      <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': open }" />
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-10 mt-2 w-56 rounded-xl border border-accent-border/40 bg-surface p-3 text-left shadow-lg"
    >
      <div class="space-y-1.5">
        <UiLabel for="menu-display-name" class="text-xs">
          Nome de exibição
        </UiLabel>
        <UiInput
          id="menu-display-name"
          v-model="newName"
          :placeholder="displayName"
        />
        <UiButton
          class="w-full"
          size="sm"
          :disabled="savingName || !newName.trim()"
          @click="handleSaveName"
        >
          {{ savingName ? "Salvando..." : "Salvar" }}
        </UiButton>
        <p v-if="savingNameError" class="text-xs text-red-600">
          {{ savingNameError }}
        </p>
      </div>

      <div class="my-3 border-t border-accent-border/40" />

      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-secondary transition-colors hover:bg-section"
        @click="passwordModalOpen = true"
      >
        <KeyRound class="h-4 w-4" />
        Redefinir senha
      </button>

      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        @click="handleSignOut"
      >
        <DoorOpen class="h-4 w-4" />
        Sair
      </button>
    </div>

    <UiModal v-model:open="passwordModalOpen">
      <template #title>Redefinir senha</template>
      <AccountChangePasswordForm />
    </UiModal>
  </div>
</template>
