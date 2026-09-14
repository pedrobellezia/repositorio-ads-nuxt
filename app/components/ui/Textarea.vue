<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}>();

const model = defineModel<string>();
</script>

<template>
  <textarea
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="
      cn(
        'flex min-h-20 w-full rounded-lg border border-accent-border/60 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        $props.class,
      )
    "
  />
</template>
