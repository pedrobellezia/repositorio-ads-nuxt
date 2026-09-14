-- A migration 0004 concedeu grants pra anon/authenticated mas esqueceu do
-- service_role (usado pelas rotas server-side com privilegios de admin,
-- como server/api/admin/*). Sem isso, GRANT SELECT/INSERT/UPDATE/DELETE
-- falha mesmo com service_role ignorando RLS.

grant usage on schema public to service_role;

grant select, insert, update, delete on
  public.profiles,
  public.tag_categories,
  public.tags,
  public.items,
  public.item_tags
  to service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
