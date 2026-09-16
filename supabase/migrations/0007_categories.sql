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

-- 3b. Popula categorias e subcategorias padrão
insert into public.categories (name, slug, color, position) values
  ('Documentos', 'documentos', '#1e7a5e', 0),
  ('Ferramentas', 'ferramentas', '#13547a', 1),
  ('Material', 'material', '#7c3aed', 2)
on conflict (slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, 'Gerais', 'gerais', 0 from public.categories where slug = 'documentos'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, 'Projetos Técnicos', 'projetos-tecnicos', 1 from public.categories where slug = 'documentos'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, '1ª Fase', '1fase', 0 from public.categories where slug = 'ferramentas'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, '2ª Fase', '2fase', 1 from public.categories where slug = 'ferramentas'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, '3ª Fase', '3fase', 2 from public.categories where slug = 'ferramentas'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, '4ª Fase', '4fase', 3 from public.categories where slug = 'ferramentas'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, '5ª Fase', '5fase', 4 from public.categories where slug = 'ferramentas'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, 'Tutorial de Estrutura de Dados', 'estrutura-de-dados', 0 from public.categories where slug = 'material'
on conflict (category_id, slug) do nothing;

insert into public.subcategories (category_id, name, slug, position)
select id, 'Curso de Git e GitHub', 'git-github', 1 from public.categories where slug = 'material'
on conflict (category_id, slug) do nothing;

-- 3c. Migra itens existentes usando o campo phase
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'phase'
  ) then
    update public.items
    set subcategory_id = (
      select s.id from public.subcategories s
      join public.categories c on c.id = s.category_id
      where c.slug = 'documentos' and s.slug = 'gerais'
    )
    where phase = 'geral' and subcategory_id is null;

    update public.items
    set subcategory_id = (
      select s.id from public.subcategories s
      join public.categories c on c.id = s.category_id
      where c.slug = 'ferramentas' and s.slug = items.phase
    )
    where phase in ('1fase', '2fase', '3fase', '4fase', '5fase') and subcategory_id is null;

    update public.items
    set subcategory_id = (
      select s.id from public.subcategories s
      join public.categories c on c.id = s.category_id
      where c.slug = 'documentos' and s.slug = 'gerais'
    )
    where subcategory_id is null;
  end if;
end $$;

create index if not exists items_subcategory_id_idx
  on public.items (subcategory_id);

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
