<script setup lang="ts">
import { computed } from "vue";
import { TAG_ICONS, TAG_ICON_DEFAULT } from "@/lib/tag-icons";

const props = defineProps<{
  icon: string | null;
  class?: string;
}>();

const IconComponent = computed(
  () => (props.icon && TAG_ICONS[props.icon]) || TAG_ICON_DEFAULT,
);
</script>

<template>
  <component :is="IconComponent" :class="props.class" />
</template>
