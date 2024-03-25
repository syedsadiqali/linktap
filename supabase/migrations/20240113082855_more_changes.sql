create table "public"."links" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "link_url" text not null,
    "user_handle" text not null,
    "link_type" text not null,
    "link_text" text
);


alter table "public"."links" enable row level security;

alter table "public"."users" add column "user_image" text;

CREATE UNIQUE INDEX links_pkey ON public.links USING btree (id);

alter table "public"."links" add constraint "links_pkey" PRIMARY KEY using index "links_pkey";

alter table "public"."links" add constraint "links_user_handle_fkey" FOREIGN KEY (user_handle) REFERENCES users(user_handle) not valid;

alter table "public"."links" validate constraint "links_user_handle_fkey";

grant delete on table "public"."links" to "anon";

grant insert on table "public"."links" to "anon";

grant references on table "public"."links" to "anon";

grant select on table "public"."links" to "anon";

grant trigger on table "public"."links" to "anon";

grant truncate on table "public"."links" to "anon";

grant update on table "public"."links" to "anon";

grant delete on table "public"."links" to "authenticated";

grant insert on table "public"."links" to "authenticated";

grant references on table "public"."links" to "authenticated";

grant select on table "public"."links" to "authenticated";

grant trigger on table "public"."links" to "authenticated";

grant truncate on table "public"."links" to "authenticated";

grant update on table "public"."links" to "authenticated";

grant delete on table "public"."links" to "service_role";

grant insert on table "public"."links" to "service_role";

grant references on table "public"."links" to "service_role";

grant select on table "public"."links" to "service_role";

grant trigger on table "public"."links" to "service_role";

grant truncate on table "public"."links" to "service_role";

grant update on table "public"."links" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."links"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."links"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."links"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."links"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);



