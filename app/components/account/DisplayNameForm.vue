<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  currentName: string;
}>();

const { updateDisplayName } = useAccountActions();

const name = ref(props.currentName);
const status = ref<"idle" | "saving" | "saved" | "error">("idle");

watch(
  () => props.currentName,
  (value) => {
    name.value = value;
  },
);

async function handleSubmit() {
  if (!name.value.trim()) return;

  status.value = "saving";
  try {
    await updateDisplayName(name.value);
    status.value = "saved";
  } catch {
    status.value = "error";
  }
}
</script>

<template>
  <form
    class="space-y-4 rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]"
    @submit.prevent="handleSubmit"
  >
    <h2 class="text-sm font-heading font-semibold text-secondary">Meu nome</h2>

    <div class="space-y-1.5">
      <UiLabel for="display-name">Nome</UiLabel>
      <UiInput id="display-name" v-model="name" required />
    </div>

    <p v-if="status === 'saved'" class="text-sm text-green-600">
      Nome atualizado.
    </p>
    <p v-if="status === 'error'" class="text-sm text-red-600">
      Erro ao atualizar o nome.
    </p>

    <UiButton type="submit" :disabled="status === 'saving'">
      {{ status === "saving" ? "Salvando..." : "Salvar nome" }}
    </UiButton>
  </form>
</template>
