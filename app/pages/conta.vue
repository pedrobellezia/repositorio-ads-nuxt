<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { data: profile } = useProfile();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-heading font-bold text-secondary">Minha conta</h1>
      <p class="text-sm text-slate-500">
        Atualize seu nome de exibição ou troque sua senha.
      </p>
    </div>

    <AccountDisplayNameForm :current-name="profile?.display_name ?? ''" />
    <AccountChangePasswordForm />
  </div>
</template>
