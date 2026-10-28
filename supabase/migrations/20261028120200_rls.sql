-- Row Level Security del contenido.
--
-- La regla es la misma en las cinco tablas: cualquiera lee, solo los admins escriben.
-- El sitio es público y se consulta sin iniciar sesión, así que la lectura tiene que
-- estar abierta; lo que se protege es quién puede cambiar lo que se muestra.
--
-- La clave secret (service_role) se salta el RLS por completo, que es como el script
-- scripts/cargar-supabase.mjs puede sembrar los datos sin ser un usuario admin.
--
-- Ojo: activar RLS sin crear políticas no "abre" la tabla, la cierra entera. Por eso
-- cada tabla de abajo lleva sus cuatro políticas.

-- --- Comunidades -----------------------------------------------------------

alter table public.communities enable row level security;

create policy "communities: lectura pública"
  on public.communities for select using (true);

create policy "communities: insertan admins"
  on public.communities for insert with check (public.is_admin());

create policy "communities: actualizan admins"
  on public.communities for update using (public.is_admin()) with check (public.is_admin());

create policy "communities: borran admins"
  on public.communities for delete using (public.is_admin());

-- --- Productos -------------------------------------------------------------

alter table public.products enable row level security;

create policy "products: lectura pública"
  on public.products for select using (true);

create policy "products: insertan admins"
  on public.products for insert with check (public.is_admin());

create policy "products: actualizan admins"
  on public.products for update using (public.is_admin()) with check (public.is_admin());

create policy "products: borran admins"
  on public.products for delete using (public.is_admin());

-- --- Fotos de producto -----------------------------------------------------

alter table public.product_images enable row level security;

create policy "product_images: lectura pública"
  on public.product_images for select using (true);

create policy "product_images: insertan admins"
  on public.product_images for insert with check (public.is_admin());

create policy "product_images: actualizan admins"
  on public.product_images for update using (public.is_admin()) with check (public.is_admin());

create policy "product_images: borran admins"
  on public.product_images for delete using (public.is_admin());

-- --- Eventos ---------------------------------------------------------------

alter table public.events enable row level security;

create policy "events: lectura pública"
  on public.events for select using (true);

create policy "events: insertan admins"
  on public.events for insert with check (public.is_admin());

create policy "events: actualizan admins"
  on public.events for update using (public.is_admin()) with check (public.is_admin());

create policy "events: borran admins"
  on public.events for delete using (public.is_admin());

-- --- Noticias --------------------------------------------------------------

alter table public.news enable row level security;

create policy "news: lectura pública"
  on public.news for select using (true);

create policy "news: insertan admins"
  on public.news for insert with check (public.is_admin());

create policy "news: actualizan admins"
  on public.news for update using (public.is_admin()) with check (public.is_admin());

create policy "news: borran admins"
  on public.news for delete using (public.is_admin());
