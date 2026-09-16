<script setup lang="ts">
const { open, mode, options, handleConfirm, handleCancel } = useDialog();
</script>

<template>
  <UiModal :open="open" @update:open="(v) => !v && handleCancel()">
    <template #title>{{ options.title }}</template>
    <template v-if="options.description" #description>
      {{ options.description }}
    </template>

    <template #footer>
      <UiButton v-if="mode === 'confirm'" variant="ghost" @click="handleCancel">
        {{ options.cancelLabel ?? "Cancelar" }}
      </UiButton>
      <UiButton
        :variant="options.variant === 'destructive' ? 'destructive' : 'default'"
        @click="handleConfirm"
      >
        {{ options.confirmLabel ?? (mode === "alert" ? "OK" : "Confirmar") }}
      </UiButton>
    </template>
  </UiModal>
</template>
