import {
  Code,
  Network,
  FileText,
  BookOpen,
  Wrench,
  Monitor,
  Terminal,
  Globe,
  Database,
  Cloud,
  Smartphone,
  Server,
  Shield,
  GitBranch,
  Layers,
  Cpu,
  Palette,
  FlaskConical,
  Puzzle,
  Package,
  Braces,
  Bug,
  Lock,
  Wifi,
  GraduationCap,
  Presentation,
  Calculator,
  Video,
  Image,
  Map,
  Link,
  Rocket,
  Zap,
  Target,
  Users,
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
  database: Database,
  cloud: Cloud,
  smartphone: Smartphone,
  server: Server,
  shield: Shield,
  "git-branch": GitBranch,
  layers: Layers,
  cpu: Cpu,
  palette: Palette,
  "flask-conical": FlaskConical,
  puzzle: Puzzle,
  package: Package,
  braces: Braces,
  bug: Bug,
  lock: Lock,
  wifi: Wifi,
  "graduation-cap": GraduationCap,
  presentation: Presentation,
  calculator: Calculator,
  video: Video,
  image: Image,
  map: Map,
  link: Link,
  rocket: Rocket,
  zap: Zap,
  target: Target,
  users: Users,
};

export const TAG_ICON_DEFAULT = TagIconDefault;

export const TAG_ICON_OPTIONS = Object.keys(TAG_ICONS);

// Os 15 ícones mais úteis pra um repositório acadêmico de ADS — mostrados
// por padrão no seletor. O resto dos ~1800 ícones do lucide fica disponível
// via busca (ver searchIcons), carregado sob demanda.
export const TAG_ICON_COMMON: string[] = [
  "book",
  "file-text",
  "graduation-cap",
  "code",
  "database",
  "globe",
  "video",
  "presentation",
  "calculator",
  "link",
  "image",
  "network",
  "terminal",
  "users",
  "puzzle",
];

const NON_ICON_EXPORTS = new Set(["Icon", "createLucideIcon", "default"]);

function isIconComponent(value: unknown): value is Component {
  return (
    typeof value === "function" ||
    (typeof value === "object" &&
      value !== null &&
      ("render" in value || "setup" in value || "__name" in value))
  );
}

function toKebabCase(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function toPascalCase(kebab: string) {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

let allIconsPromise: Promise<Record<string, unknown>> | null = null;

function loadAllIcons() {
  allIconsPromise ??= import("@lucide/vue") as Promise<Record<string, unknown>>;
  return allIconsPromise;
}

export async function resolveDynamicIcon(
  kebabName: string,
): Promise<Component | null> {
  const mod = await loadAllIcons();
  const candidate = mod[toPascalCase(kebabName)];
  return isIconComponent(candidate) ? candidate : null;
}

export async function searchIcons(
  query: string,
  limit = 40,
): Promise<{ key: string; component: Component }[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const mod = await loadAllIcons();
  const seen = new Set<unknown>();
  const results: { key: string; component: Component }[] = [];

  for (const [name, value] of Object.entries(mod)) {
    if (NON_ICON_EXPORTS.has(name)) continue;
    if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) continue;
    if (!isIconComponent(value) || seen.has(value)) continue;

    const kebab = toKebabCase(name);
    if (!kebab.includes(q)) continue;

    seen.add(value);
    results.push({ key: kebab, component: value });
    if (results.length >= limit) break;
  }

  return results;
}
