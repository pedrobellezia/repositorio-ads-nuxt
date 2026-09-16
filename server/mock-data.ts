import type { CategoryWithSubs, ItemWithTags, Tag } from "@/lib/types";

// ── Tags ──────────────────────────────────────────────────────────────────

const tagLinguagens: Tag = {
  id: "tag-1",
  name: "JavaScript",
  slug: "javascript",
  icon: null,
  created_by: null,
  created_at: "2026-01-10T12:00:00.000Z",
};

const tagBanco: Tag = {
  id: "tag-2",
  name: "SQL",
  slug: "sql",
  icon: null,
  created_by: null,
  created_at: "2026-01-10T12:00:00.000Z",
};

const tagRedes: Tag = {
  id: "tag-3",
  name: "TCP/IP",
  slug: "tcp-ip",
  icon: null,
  created_by: null,
  created_at: "2026-01-10T12:00:00.000Z",
};

// ── Categories & subcategories ────────────────────────────────────────────

export const mockCategories: CategoryWithSubs[] = [
  {
    id: "cat-1",
    name: "Documentos",
    slug: "documentos",
    color: "#1e7a5e",
    position: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    subcategories: [
      {
        id: "sub-1",
        category_id: "cat-1",
        name: "Gerais",
        slug: "gerais",
        position: 0,
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "sub-2",
        category_id: "cat-1",
        name: "Projetos Técnicos",
        slug: "projetos-tecnicos",
        position: 1,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
  {
    id: "cat-2",
    name: "Ferramentas",
    slug: "ferramentas",
    color: "#13547a",
    position: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    subcategories: [
      {
        id: "sub-3",
        category_id: "cat-2",
        name: "1ª Fase",
        slug: "1fase",
        position: 0,
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "sub-4",
        category_id: "cat-2",
        name: "2ª Fase",
        slug: "2fase",
        position: 1,
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "sub-5",
        category_id: "cat-2",
        name: "3ª Fase",
        slug: "3fase",
        position: 2,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
  {
    id: "cat-3",
    name: "Material",
    slug: "material",
    color: "#7c3aed",
    position: 2,
    created_at: "2026-01-01T00:00:00.000Z",
    subcategories: [
      {
        id: "sub-6",
        category_id: "cat-3",
        name: "Tutorial de Estrutura de Dados",
        slug: "estrutura-de-dados",
        position: 0,
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "sub-7",
        category_id: "cat-3",
        name: "Curso de Git e GitHub",
        slug: "git-github",
        position: 1,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
];

// ── Items ─────────────────────────────────────────────────────────────────

export const mockItems: ItemWithTags[] = [
  {
    id: "item-1",
    name: "Introdução ao JavaScript",
    description: "Slides e exercícios da primeira aula de programação web.",
    subcategory_id: "sub-3",
    professor_name: "Profa. Ana Souza",
    link_url: "https://example.com/js-intro",
    file_path: null,
    created_by: null,
    created_at: "2026-02-01T10:00:00.000Z",
    updated_at: "2026-02-01T10:00:00.000Z",
    tags: [tagLinguagens],
    subcategory: {
      id: "sub-3",
      category_id: "cat-2",
      name: "1ª Fase",
      slug: "1fase",
      position: 0,
      created_at: "2026-01-01T00:00:00.000Z",
      category: mockCategories[1]!,
    },
  },
  {
    id: "item-2",
    name: "Modelagem de banco de dados",
    description: "Material sobre modelo entidade-relacionamento e normalização.",
    subcategory_id: "sub-4",
    professor_name: "Prof. Carlos Lima",
    link_url: "https://example.com/modelagem-bd",
    file_path: null,
    created_by: null,
    created_at: "2026-02-05T10:00:00.000Z",
    updated_at: "2026-02-05T10:00:00.000Z",
    tags: [tagBanco],
    subcategory: {
      id: "sub-4",
      category_id: "cat-2",
      name: "2ª Fase",
      slug: "2fase",
      position: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      category: mockCategories[1]!,
    },
  },
  {
    id: "item-3",
    name: "Fundamentos de redes de computadores",
    description: "Apostila sobre a pilha TCP/IP e roteamento.",
    subcategory_id: "sub-6",
    professor_name: "Prof. Bruno Alves",
    link_url: null,
    file_path: "redes/fundamentos-redes.pdf",
    created_by: null,
    created_at: "2026-02-10T10:00:00.000Z",
    updated_at: "2026-02-10T10:00:00.000Z",
    tags: [tagRedes, tagLinguagens],
    subcategory: {
      id: "sub-6",
      category_id: "cat-3",
      name: "Tutorial de Estrutura de Dados",
      slug: "estrutura-de-dados",
      position: 0,
      created_at: "2026-01-01T00:00:00.000Z",
      category: mockCategories[2]!,
    },
  },
];

export const mockTags: Tag[] = [tagLinguagens, tagBanco, tagRedes];
