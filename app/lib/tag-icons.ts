import {
  Code,
  Network,
  FileText,
  BookOpen,
  Wrench,
  Monitor,
  Terminal,
  Globe,
  Tag as TagIconDefault,
} from "@lucide/vue";
import type { Component } from "vue";

export const TAG_ICONS: Record<string, Component> = {
  code: Code,
  network: Network,
  "file-text": FileText,
  book: BookOpen,
  wrench: Wrench,
  monitor: Monitor,
  terminal: Terminal,
  globe: Globe,
};

export const TAG_ICON_DEFAULT = TagIconDefault;

export const TAG_ICON_OPTIONS = Object.keys(TAG_ICONS);
