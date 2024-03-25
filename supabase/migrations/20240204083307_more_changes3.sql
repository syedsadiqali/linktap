
CREATE UNIQUE INDEX no_duplicate_links ON public.links USING btree (link_url, user_handle);

alter table "public"."links" add constraint "no_duplicate_links" UNIQUE using index "no_duplicate_links";


