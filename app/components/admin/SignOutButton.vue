<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{ class?: string }>();

const router = useRouter();
const supabase = useSupabaseClient();

async function handleSignOut() {
  await supabase.auth.signOut();
  await router.push("/");
}
</script>

<template>
  <UiButton variant="ghost" size="sm" :class="$props.class" @click="handleSignOut">
    Sair
  </UiButton>
</template>
