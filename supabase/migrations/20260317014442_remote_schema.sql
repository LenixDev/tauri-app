drop extension if exists "pg_net";

create type "public"."user_permissions" as enum ('create:user', 'read:users', 'delete:user');

drop policy "users can read own profile" on "public"."users";


  create table "public"."role_permissions" (
    "created_at" timestamp with time zone not null default now(),
    "role" public.user_role not null,
    "permissions" public.user_permissions[] not null
      );


alter table "public"."role_permissions" enable row level security;

alter table "public"."users" add column "created_at" timestamp with time zone not null default now();

alter table "public"."users" add column "identifier" integer not null;

alter table "public"."users" alter column "id" set default auth.uid();

CREATE UNIQUE INDEX role_permissions_pkey ON public.role_permissions USING btree (role, permissions);

CREATE UNIQUE INDEX users_id_key ON public.users USING btree (id);

CREATE UNIQUE INDEX users_identifier_key ON public.users USING btree (identifier);

alter table "public"."role_permissions" add constraint "role_permissions_pkey" PRIMARY KEY using index "role_permissions_pkey";

alter table "public"."users" add constraint "users_id_key" UNIQUE using index "users_id_key";

alter table "public"."users" add constraint "users_identifier_key" UNIQUE using index "users_identifier_key";

grant delete on table "public"."role_permissions" to "anon";

grant insert on table "public"."role_permissions" to "anon";

grant references on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "anon";

grant trigger on table "public"."role_permissions" to "anon";

grant truncate on table "public"."role_permissions" to "anon";

grant update on table "public"."role_permissions" to "anon";

grant delete on table "public"."role_permissions" to "authenticated";

grant insert on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "authenticated";

grant select on table "public"."role_permissions" to "authenticated";

grant trigger on table "public"."role_permissions" to "authenticated";

grant truncate on table "public"."role_permissions" to "authenticated";

grant update on table "public"."role_permissions" to "authenticated";

grant delete on table "public"."role_permissions" to "service_role";

grant insert on table "public"."role_permissions" to "service_role";

grant references on table "public"."role_permissions" to "service_role";

grant select on table "public"."role_permissions" to "service_role";

grant trigger on table "public"."role_permissions" to "service_role";

grant truncate on table "public"."role_permissions" to "service_role";

grant update on table "public"."role_permissions" to "service_role";


  create policy "Enable read access for all users"
  on "public"."role_permissions"
  as permissive
  for select
  to public
using (true);



  create policy "Enable users to view their own data only"
  on "public"."users"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



