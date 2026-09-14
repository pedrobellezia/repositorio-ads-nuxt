<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        secondary: "border-transparent bg-section text-secondary",
        outline: "border-accent-border text-secondary",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

withDefaults(
  defineProps<{
    variant?: BadgeVariant;
    class?: string;
  }>(),
  {
    variant: "secondary",
  },
);
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), $props.class)">
    <slot />
  </span>
</template>
