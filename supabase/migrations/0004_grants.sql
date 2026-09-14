-- As policies de RLS por si só não bastam: o Postgres também exige GRANT
-- de privilégios nas tabelas para as roles anon/authenticated. Essas grants
-- normalmente vêm por padrão em projetos Supabase, mas faltaram aqui.

grant usage on schema public to anon, authenticated;

grant select on public.profiles, public.tag_categories, public.tags, public.items, public.item_tags
  to anon, authenticated;

grant insert, update, delete on public.tag_categories, public.tags, public.items, public.item_tags
  to authenticated;

grant update on public.profiles to authenticated;

grant execute on function public.search_similar_tags(uuid, text) to anon, authenticated;

-- Garante que tabelas futuras criadas pelo mesmo role já saiam com as grants certas.
alter default privileges in schema public
  grant select on tables to anon, authenticated;

alter default privileges in schema public
  grant insert, update, delete on tables to authenticated;
