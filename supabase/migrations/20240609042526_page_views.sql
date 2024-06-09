drop function if exists "public"."increment_link_clicks"(link_id bigint);

alter table "public"."pages" add column "page_views" bigint default '0'::bigint;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  update public.links
  set link_clicks = link_clicks + 1
  where id = link_id;
end;$function$
;

CREATE OR REPLACE FUNCTION public.increment_page_views(page_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  update public.pages
  set page_views = page_views + 1
  where id = page_id;
end;$function$
;


