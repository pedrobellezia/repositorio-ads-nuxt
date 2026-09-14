<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  itemId: string;
}>();

const { deleteItem } = useItemActions();
const pending = ref(false);

async function handleDelete() {
  if (!confirm("Excluir este item? Essa ação não pode ser desfeita.")) return;

  pending.value = true;
  try {
    await deleteItem(props.itemId);
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
