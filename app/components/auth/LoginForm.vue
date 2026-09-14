<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();

const next = (route.query.next as string) ?? "/admin";

const email = ref("");
const password = ref("");
const status = ref<"idle" | "sending" | "error">("idle");

async function handleSubmit() {
  status.value = "sending";

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    status.value = "error";
    return;
  }

  status.value = "idle";
  await router.push(next);
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
