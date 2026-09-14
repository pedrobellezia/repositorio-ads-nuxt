<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ created: [] }>();

const email = ref("");
const password = ref("");
const displayName = ref("");
const status = ref<"idle" | "sending" | "sent" | "error">("idle");
const errorMessage = ref("");

async function handleSubmit() {
  status.value = "sending";

  try {
    await $fetch("/api/admin/invite-professor", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        display_name: displayName.value,
      },
    });

    status.value = "sent";
    email.value = "";
    password.value = "";
    displayName.value = "";
    emit("created");
  } catch (err) {
    const data = (err as { data?: { statusMessage?: string } })?.data;
    errorMessage.value = data?.statusMessage ?? "Erro ao enviar convite.";
    status.value = "error";
  }
}
</script>

<template>
  <form
    class="space-y-4 rounded-xl border border-accent-border/20 bg-surface p-4 shadow-[0_1px_0.5rem_-0.25rem_rgba(3,46,71,0.1)]"
    @submit.prevent="handleSubmit"
  >
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="space-y-1.5">
        <UiLabel for="invite-email">E-mail do professor</UiLabel>
        <UiInput id="invite-email" v-model="email" type="email" required />
      </div>
      <div class="space-y-1.5">
        <UiLabel for="invite-name">Nome</UiLabel>
        <UiInput id="invite-name" v-model="displayName" />
      </div>
      <div class="space-y-1.5">
        <UiLabel for="invite-password">Senha inicial</UiLabel>
        <UiInput
          id="invite-password"
          v-model="password"
          type="text"
          required
          minlength="6"
        />
      </div>
    </div>

    <p v-if="status === 'sent'" class="text-sm text-green-600">
      Professor criado com sucesso.
    </p>
    <p v-if="status === 'error'" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <UiButton type="submit" :disabled="status === 'sending'">
      {{ status === "sending" ? "Enviando..." : "Convidar professor" }}
    </UiButton>
  </form>
</template>
