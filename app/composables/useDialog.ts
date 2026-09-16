import { ref } from "vue";

export type DialogOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
};

type DialogMode = "confirm" | "alert";

const open = ref(false);
const mode = ref<DialogMode>("confirm");
const options = ref<DialogOptions>({ title: "" });
let resolver: ((value: boolean) => void) | null = null;

function normalize(opts: DialogOptions | string): DialogOptions {
  return typeof opts === "string" ? { title: opts } : opts;
}

export function useDialog() {
  function confirmDialog(opts: DialogOptions | string) {
    mode.value = "confirm";
    options.value = normalize(opts);
    open.value = true;
    return new Promise<boolean>((resolve) => {
      resolver = resolve;
    });
  }

  function alertDialog(opts: DialogOptions | string) {
    mode.value = "alert";
    options.value = normalize(opts);
    open.value = true;
    return new Promise<void>((resolve) => {
      resolver = () => resolve();
    });
  }

  function handleConfirm() {
    open.value = false;
    resolver?.(true);
    resolver = null;
  }

  function handleCancel() {
    open.value = false;
    resolver?.(false);
    resolver = null;
  }

  return { open, mode, options, confirmDialog, alertDialog, handleConfirm, handleCancel };
}
