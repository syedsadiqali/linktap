alter table "public"."links" drop column "link_text";

alter table "public"."links" add column "link_label" text not null;


