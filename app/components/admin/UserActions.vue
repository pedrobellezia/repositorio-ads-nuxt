<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  userId: string;
}>();

const emit = defineEmits<{ changed: [] }>();

const { confirmDialog, alertDialog } = useDialog();

const resetting = ref(false);
const deleting = ref(false);
const generatedPassword = ref<string | null>(null);

async function handleResetPassword() {
  const confirmed = await confirmDialog({
    title: "Redefinir senha",
    description: "Gerar uma nova senha para este usuário?",
    confirmLabel: "Gerar senha",
  });
  if (!confirmed) return;

  resetting.value = true;
  try {
    const { password } = await $fetch<{ password: string }>(
      "/api/admin/reset-password",
      { method: "POST", body: { userId: props.userId } },
    );
    generatedPassword.value = password;
  } catch (err) {
    const data = (err as { data?: { statusMessage?: string } })?.data;
    await alertDialog({
      title: "Erro",
      description: data?.statusMessage ?? "Erro ao resetar senha.",
    });
  } finally {
    resetting.value = false;
  }
}

async function handleDelete() {
  const confirmed = await confirmDialog({
    title: "Excluir usuário",
    description: "Excluir este usuário? Essa ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    variant: "destructive",
  });
  if (!confirmed) return;

  deleting.value = true;
  try {
    await $fetch("/api/admin/delete-user", {
      method: "POST",
      body: { userId: props.userId },
    });
    emit("changed");
  } catch (err) {
    const data = (err as { data?: { statusMessage?: string } })?.data;
    await alertDialog({
      title: "Erro",
      description: data?.statusMessage ?? "Erro ao excluir usuário.",
    });
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UiButton
      variant="outline"
      size="sm"
      :disabled="resetting"
      @click="handleResetPassword"
    >
      {{ resetting ? "Gerando..." : "Resetar senha" }}
    </UiButton>
    <UiButton
      variant="destructive"
      size="sm"
      :disabled="deleting"
      @click="handleDelete"
    >
      Excluir
    </UiButton>

    <UiModal
      :open="generatedPassword !== null"
      @update:open="(v) => !v && (generatedPassword = null)"
    >
      <template #title>Nova senha gerada</template>
      <template #description>
        Repasse essa senha ao usuário. Ela não será mostrada novamente.
      </template>

      <p class="rounded-lg bg-section p-3 text-center font-mono text-lg font-semibold text-secondary">
        {{ generatedPassword }}
      </p>

      <div class="mt-6 flex justify-end">
        <UiButton @click="generatedPassword = null">Fechar</UiButton>
      </div>
    </UiModal>
  </div>
</template>
