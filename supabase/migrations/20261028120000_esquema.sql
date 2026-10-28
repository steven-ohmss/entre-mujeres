-- Esquema de contenido de Entre mujeres.
--
-- Refleja los tipos de types/index.ts. Los valores de los filtros del sitio (categorías,
-- tipos de producto, localidades) van como enums de Postgres y no como texto libre: si
-- alguien escribe "Gastronomia" sin tilde, la inserción falla en vez de que el producto
-- desaparezca en silencio del filtro.
--
-- Lo que todavía no entrega el equipo va NULL, no con la cadena "PENDIENTE": la interfaz
-- ya trata null y vacío como pendiente (ver esPendiente() en config/site.ts).

-- --- Tipos -----------------------------------------------------------------

create type public.community_category as enum (
  'Comunidades rurales', 'Productoras', 'Emprendimientos', 'Servicios de apoyo'
);

create type public.product_type as enum (
  'Artesanías', 'Turismo rural', 'Ropa y textiles', 'Souvenirs',
  'Educación y formación', 'Gastronomía', 'Otros'
);

create type public.availability as enum ('Disponible', 'Por encargo', 'Por temporada');

create type public.event_type as enum (
  'Feria', 'Taller', 'Reunión', 'Actividad comunitaria', 'Evento de apoyo', 'Otro'
);

create type public.organizer as enum ('Red Mujer', 'Otras comunidades', 'Aliados');

create type public.news_type as enum (
  'Historia', 'Noticia', 'Actividad reciente', 'Proyecto destacado'
);

create type public.localidad as enum (
  'Usaquén', 'Chapinero', 'Santa Fe', 'San Cristóbal', 'Usme', 'Bosa', 'Kennedy',
  'Fontibón', 'Engativá', 'Suba', 'Ciudad Bolívar', 'Sumapaz'
);

-- --- updated_at ------------------------------------------------------------

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --- Comunidades -----------------------------------------------------------

create table public.communities (
  id                uuid primary key default gen_random_uuid(),
  -- Clave natural: es lo que va en la URL (/comunidades/<slug>) y por lo que el script
  -- de carga hace upsert, para que se pueda correr dos veces sin duplicar nada.
  slug              text not null unique,
  name              text not null,
  -- NULL mientras la comunidad no confirme su categoría. Sin categoría no entra en
  -- ningún filtro concreto, pero sí sigue saliendo con "Todas las categorías".
  category          public.community_category,
  localidad         public.localidad not null,
  ubicacion         text not null,
  short_description text,
  who_we_are        text,
  what_we_do        text,
  -- Ruta dentro del bucket "imagenes", por ejemplo "comunidades/red-mujer.jpg".
  -- NULL = la interfaz muestra "Foto próximamente".
  image_path        text,
  image_alt         text,
  -- Punto en el mapa. Va aquí y no en una tabla aparte porque la relación es 1:1: cada
  -- comunidad tiene un lugar. Verificar con scripts/verificar-marcadores.mjs que cae
  -- dentro de la localidad declarada.
  lat               double precision,
  lng               double precision,
  whatsapp          text,
  phone             text,
  email             text,
  social            text,
  catalog_url       text,
  -- true = el contenido se escribió como relleno para ver la página armada, no lo
  -- entregó la comunidad. Hay que confirmarlo o sacarlo (ver docs/datos-pendientes.md).
  is_example        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- O van las dos coordenadas o no va ninguna: media coordenada no ubica nada.
  constraint communities_coordenada_completa check ((lat is null) = (lng is null))
);

create trigger communities_updated_at
  before update on public.communities
  for each row execute function public.tocar_updated_at();

-- --- Productos -------------------------------------------------------------

create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  type         public.product_type not null,
  -- restrict y no cascade: borrar una comunidad no debe llevarse en silencio sus
  -- productos. Primero se decide qué pasa con ellos.
  community_id uuid not null references public.communities(id) on delete restrict,
  description  text not null,
  presentation text,
  features     text[] not null default '{}',
  -- NULL mientras la comunidad no la confirme: la etiqueta no se muestra, en vez de
  -- afirmar un "Disponible" que nadie verificó.
  availability public.availability,
  catalog_url  text,
  is_example   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index products_community_id_idx on public.products (community_id);
create index products_type_idx on public.products (type);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.tocar_updated_at();

-- --- Fotos de producto -----------------------------------------------------

create table public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  -- Único en toda la tabla a propósito: la regla de docs/guia-material.md es que ninguna
  -- foto se repite entre dos productos distintos. Aquí esa regla deja de depender de que
  -- alguien se acuerde.
  storage_path text not null unique,
  -- Obligatorio: describe lo que se ve, no el nombre del producto. Es lo que oye quien
  -- usa lector de pantalla. Sin esta restricción vuelve a entrar una foto sin descripción.
  alt          text not null check (length(btrim(alt)) > 0),
  -- 0 es la foto principal, la que sale en la tarjeta y en el buscador.
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  unique (product_id, position)
);

create index product_images_product_id_idx on public.product_images (product_id);

-- --- Eventos ---------------------------------------------------------------

create table public.events (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  date         date not null,
  -- Texto y no time: son de presentación ("8:00 a.m."), se muestran tal cual.
  start_time   text,
  end_time     text,
  location     text not null,
  localidad    public.localidad not null,
  type         public.event_type not null,
  organizer    public.organizer not null,
  -- set null: si la comunidad sale de la red, el evento sigue existiendo sin ella.
  community_id uuid references public.communities(id) on delete set null,
  description  text,
  image_path   text,
  image_alt    text,
  is_example   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index events_date_idx on public.events (date);

create trigger events_updated_at
  before update on public.events
  for each row execute function public.tocar_updated_at();

-- --- Noticias --------------------------------------------------------------

create table public.news (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  type       public.news_type not null,
  title      text not null,
  date       date not null,
  summary    text,
  full_text  text,
  image_path text,
  image_alt  text,
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_date_idx on public.news (date);

create trigger news_updated_at
  before update on public.news
  for each row execute function public.tocar_updated_at();
