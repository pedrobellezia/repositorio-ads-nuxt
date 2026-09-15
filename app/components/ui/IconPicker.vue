<script setup lang="ts">
import { TAG_ICON_OPTIONS } from "@/lib/tag-icons";
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();

const model = defineModel<string>({ required: true });
</script>

<template>
  <div :class="cn('flex flex-wrap gap-1.5', $props.class)">
    <button
      v-for="opt in TAG_ICON_OPTIONS"
      :key="opt"
      type="button"
      :title="opt"
      :aria-label="opt"
      :class="
        cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
          model === opt
            ? 'border-secondary bg-secondary text-white'
            : 'border-accent-border/60 bg-white text-secondary hover:bg-section',
        )
      "
      @click="model = opt"
    >
      <SiteTagIcon :icon="opt" class="h-4 w-4" />
    </button>
  </div>
</template>
