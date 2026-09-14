<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  class?: string;
}>();

const model = defineModel<string>();
</script>

<template>
  <select
    v-model="model"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-accent-border/60 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary',
        $props.class,
      )
    "
  >
    <slot />
  </select>
</template>
