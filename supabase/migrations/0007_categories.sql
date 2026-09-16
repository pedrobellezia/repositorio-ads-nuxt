-- ============================================================
-- 0007_categories.sql
-- Substitui o campo "phase" por um sistema genérico de
-- categorias (categories) e subcategorias (subcategories).
-- ============================================================

-- 1. Tabela de categorias
create table if not exists public.categories (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  slug     text not null unique,
  color    text not null default '#13547a', -- hexcode exibido nos cards
  position int  not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Tabela de subcategorias
create table if not exists public.subcategories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name        text not null,
  slug        text not null,
  position    int  not null default 0,
  created_at  timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists subcategories_category_id_idx
  on public.subcategories (category_id);

-- 3. Adiciona subcategory_id em items (nullable por ora, para não quebrar
--    a constraint enquanto populamos os dados)
alter table public.items
  add column if not exists subcategory_id uuid
    references public.subcategories (id) on delete restrict;

-- 4. Remove a constraint de fase e a coluna phase
alter table public.items drop constraint if exists items_phase_check;
drop  index  if exists public.items_phase_idx;
alter table public.items drop column if exists phase;

-- 5. RLS para categories e subcategories:
--    leitura pública, escrita para qualquer autenticado
alter table public.categories    enable row level security;
alter table public.subcategories enable row level security;

create policy "categories_select_all" on public.categories
  for select using (true);

create policy "categories_authenticated_write" on public.categories
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "subcategories_select_all" on public.subcategories
  for select using (true);

create policy "subcategories_authenticated_write" on public.subcategories
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- 6. Grants para anon e authenticated poderem ler
grant select on public.categories    to anon, authenticated;
grant select on public.subcategories to anon, authenticated;
grant insert, update, delete on public.categories    to authenticated;
grant insert, update, delete on public.subcategories to authenticated;
