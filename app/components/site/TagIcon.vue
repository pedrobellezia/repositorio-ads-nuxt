<script setup lang="ts">
import { computed, shallowRef, watchEffect } from "vue";
import type { Component } from "vue";
import { TAG_ICONS, TAG_ICON_DEFAULT, resolveDynamicIcon } from "@/lib/tag-icons";

const props = defineProps<{
  icon: string | null;
  class?: string;
}>();

// A maioria das tags usa um ícone do conjunto curado (síncrono). Se for um
// ícone escolhido via busca no seletor, resolve sob demanda no pacote todo.
const dynamicComponent = shallowRef<Component | null>(null);

watchEffect(async () => {
  dynamicComponent.value = null;
  const icon = props.icon;
  if (icon && !TAG_ICONS[icon]) {
    dynamicComponent.value = await resolveDynamicIcon(icon);
  }
});

const IconComponent = computed(() => {
  if (props.icon && TAG_ICONS[props.icon]) return TAG_ICONS[props.icon];
  return dynamicComponent.value ?? TAG_ICON_DEFAULT;
});
</script>

<template>
  <component :is="IconComponent" :class="props.class" />
</template>
