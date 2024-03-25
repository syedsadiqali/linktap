alter table "public"."links" drop constraint "links_user_handle_fkey";

alter table "public"."links" add column "link_clicks" integer not null default 0;

alter table "public"."links" alter column "link_text" set not null;

alter table "public"."users" drop column "user_image";

alter table "public"."users" add column "avatar_url" text;

alter table "public"."users" add column "bio" text default ''::text;

alter table "public"."users" add column "full_name" text default ''::text;

alter table "public"."users" alter column "user_handle" drop not null;

alter table "public"."links" add constraint "links_user_handle_fkey" FOREIGN KEY (user_handle) REFERENCES users(user_handle) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."links" validate constraint "links_user_handle_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment(url text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE links
  SET link_clicks = link_clicks + 1
  WHERE link_url = url;
END;
$function$
;

create policy "Enable update for users based on email"
on "public"."users"
as permissive
for update
to authenticated
using (true)
with check (true);



