<script setup lang="ts">
import { ref } from "vue";

const { changePassword } = useAccountActions();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const status = ref<"idle" | "saving" | "saved" | "error">("idle");
const errorMessage = ref("");

async function handleSubmit() {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "As senhas não coincidem.";
    status.value = "error";
    return;
  }

  status.value = "saving";

  try {
    await changePassword(currentPassword.value, newPassword.value);
    status.value = "saved";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (err) {
    const data = (err as { data?: { statusMessage?: string } })?.data;
    errorMessage.value = data?.statusMessage ?? "Erro ao trocar a senha.";
    status.value = "error";
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
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

    <div class="space-y-1.5">
      <UiLabel for="confirm-password">Confirmar nova senha</UiLabel>
      <UiInput
        id="confirm-password"
        v-model="confirmPassword"
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
