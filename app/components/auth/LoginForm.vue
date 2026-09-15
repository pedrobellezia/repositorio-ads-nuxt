<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const next = route.query.next as string | undefined;

const email = ref("");
const password = ref("");
const status = ref<"idle" | "sending" | "error">("idle");

async function handleSubmit() {
  status.value = "sending";

  try {
    const { redirectTo } = await $fetch<{ redirectTo: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: { email: email.value, password: password.value, next },
      },
    );

    // Navegação full-page (não router.push): garante que o cookie de sessão
    // recém-gravado pelo server já esteja presente quando o middleware
    // rodar na próxima página, evitando o loop de volta pro /login.
    window.location.href = redirectTo;
  } catch {
    status.value = "error";
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-1.5">
      <UiLabel for="email">E-mail</UiLabel>
      <UiInput
        id="email"
        v-model="email"
        type="email"
        required
        placeholder="professor@fmp.edu.br"
      />
    </div>

    <div class="space-y-1.5">
      <UiLabel for="password">Senha</UiLabel>
      <UiInput id="password" v-model="password" type="password" required />
    </div>

    <p v-if="status === 'error'" class="text-sm text-red-600">
      E-mail ou senha inválidos.
    </p>

    <UiButton type="submit" :disabled="status === 'sending'" class="w-full">
      {{ status === "sending" ? "Entrando..." : "Entrar" }}
    </UiButton>
  </form>
</template>
