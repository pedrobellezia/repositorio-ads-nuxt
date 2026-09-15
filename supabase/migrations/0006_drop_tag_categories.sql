-- Remove o conceito de categoria de tag: agora e so "tags", sem
-- agrupamento. A pedido do usuario ("tira essa categoria ai e deixa
-- so tag, tira do banco de tudo").

drop policy if exists "tag_categories_select_all" on public.tag_categories;
drop policy if exists "tag_categories_admin_write" on public.tag_categories;

alter table public.tags drop constraint if exists tags_category_id_slug_key;
drop index if exists public.tags_category_id_idx;
alter table public.tags drop column if exists category_id;
alter table public.tags add constraint tags_slug_key unique (slug);

drop function if exists public.search_similar_tags(uuid, text);

create or replace function public.search_similar_tags(p_name text)
returns table (id uuid, name text, similarity real)
language sql
stable
as $$
  select t.id, t.name, similarity(t.name, p_name) as similarity
  from public.tags t
  where similarity(t.name, p_name) > 0.3
  order by similarity desc
  limit 5;
$$;

grant execute on function public.search_similar_tags(text) to anon, authenticated;

drop table if exists public.tag_categories cascade;
