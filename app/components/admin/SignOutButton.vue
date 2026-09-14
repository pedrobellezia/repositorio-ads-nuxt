<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const supabase = useSupabaseClient();

async function handleSignOut() {
  await supabase.auth.signOut();
  await router.push("/");
}
</script>

<template>
  <UiButton variant="ghost" size="sm" @click="handleSignOut">Sair</UiButton>
</template>
