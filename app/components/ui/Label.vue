<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps<{
  for?: string;
  class?: string;
}>();
</script>

<template>
  <label
    :for="props.for"
    :class="cn('text-sm font-medium leading-none text-secondary', props.class)"
  >
    <slot />
  </label>
</template>
