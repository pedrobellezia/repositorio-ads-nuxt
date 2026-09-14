<script setup lang="ts">
import { X } from "@lucide/vue";
import { onMounted, onUnmounted, watch } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  open: boolean;
  class?: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

function close() {
  emit("update:open", false);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.open) close();
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  },
);
</script>

<template>
  <Teleport to="body">
    <div v-if="open">
      <div class="fixed inset-0 z-50 bg-black/40" @click="close" />
      <div
        :class="
          cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg',
            props.class,
          )
        "
      >
        <slot name="header">
          <div v-if="$slots.title" class="mb-4 space-y-1">
            <h2 class="text-lg font-semibold text-secondary">
              <slot name="title" />
            </h2>
            <p v-if="$slots.description" class="text-sm text-slate-500">
              <slot name="description" />
            </p>
          </div>
        </slot>

        <slot />

        <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
          <slot name="footer" />
        </div>

        <button
          type="button"
          class="absolute right-4 top-4 rounded-sm text-slate-500 hover:text-slate-900"
          @click="close"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
