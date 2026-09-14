<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  type?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  class?: string;
  accept?: string;
}>();

const model = defineModel<string>();
</script>

<template>
  <input
    :id="id"
    v-model="model"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :accept="accept"
    :class="
      cn(
        'flex h-10 w-full rounded-lg border border-accent-border/60 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        $props.class,
      )
    "
  />
</template>
