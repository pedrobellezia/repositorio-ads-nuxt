<script setup lang="ts">
import { ref } from "vue";

const { changePassword } = useAccountActions();

const currentPassword = ref("");
const newPassword = ref("");
const status = ref<"idle" | "saving" | "saved" | "error">("idle");
const errorMessage = ref("");

async function handleSubmit() {
  status.value = "saving";

  try {
    await changePassword(currentPassword.value, newPassword.value);
    status.value = "saved";
    currentPassword.value = "";
    newPassword.value = "";
  } catch (err) {
    const data = (err as { data?: { statusMessage?: string } })?.data;
    errorMessage.value = data?.statusMessage ?? "Erro ao trocar a senha.";
    status.value = "error";
  }
}
</script>

<template>
  <form
    class="space-y-4 rounded-xl border border-accent-border/40 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]"
    @submit.prevent="handleSubmit"
  >
    <h2 class="text-sm font-heading font-semibold text-secondary">Minha senha</h2>

    <div class="space-y-1.5">
      <UiLabel for="current-password">Senha atual</UiLabel>
      <UiInput
        id="current-password"
        v-model="currentPassword"
        type="password"
        required
      />
    </div>

    <div class="space-y-1.5">
      <UiLabel for="new-password">Nova senha</UiLabel>
      <UiInput
        id="new-password"
        v-model="newPassword"
        type="password"
        required
        minlength="6"
      />
    </div>

    <p v-if="status === 'saved'" class="text-sm text-green-600">
      Senha atualizada.
    </p>
    <p v-if="status === 'error'" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <UiButton type="submit" :disabled="status === 'saving'">
      {{ status === "saving" ? "Salvando..." : "Trocar senha" }}
    </UiButton>
  </form>
</template>
