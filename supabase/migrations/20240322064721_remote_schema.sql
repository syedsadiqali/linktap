drop function if exists "public"."increment"(url text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (user_id)
  values (new.id);
  return new;
end;
$function$
;


create or replace trigger after_insert_to_profile
after insert on auth.users
for each row
execute function insert_user();