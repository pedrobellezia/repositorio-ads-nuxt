<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  itemId: string;
}>();

const { deleteItem } = useItemActions();
const { confirmDialog, alertDialog } = useDialog();
const pending = ref(false);

async function handleDelete() {
  const confirmed = await confirmDialog({
    title: "Excluir item",
    description: "Excluir este item? Essa ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    variant: "destructive",
  });
  if (!confirmed) return;

  pending.value = true;
  try {
    await deleteItem(props.itemId);
  } catch (err: unknown) {
    await alertDialog({
      title: "Erro",
      description:
        err instanceof Error ? err.message : "Erro ao excluir item.",
    });
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <UiButton
    variant="destructive"
    size="sm"
    :disabled="pending"
    @click="handleDelete"
  >
    Excluir
  </UiButton>
</template>
