-- Quién puede escribir.
--
-- Un admin es alguien que inició sesión y además está en esta tabla. Estar registrado en
-- Supabase no basta: hay que agregarlo aquí a mano. Así, si algún día se abre el registro
-- al público, nadie se vuelve admin por el solo hecho de crear una cuenta.

create table public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  -- Solo para saber quién es cada fila sin tener que ir a mirar auth.users.
  nota       text,
  created_at timestamptz not null default now()
);

-- is_admin() es lo que preguntan todas las políticas de más abajo.
--
-- security definer es necesario y no un atajo: la política de, por ejemplo, products
-- tiene que poder mirar la tabla admins, pero quien escribe no tiene permiso para leerla.
-- La función corre con los permisos de su dueño y se salta el RLS de admins, así que
-- responde sí o no sin filtrar nunca la lista de administradores.
--
-- El search_path fijo evita que alguien cree una tabla "admins" en otro esquema y la
-- function termine consultando esa en lugar de esta.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- La lista de admins no es pública: nadie la lee desde el navegador, ni siquiera los
-- propios admins. Se administra desde el panel de Supabase o con la clave secret.
alter table public.admins enable row level security;

create policy "admins: solo la clave secret"
  on public.admins for all
  using (false) with check (false);
