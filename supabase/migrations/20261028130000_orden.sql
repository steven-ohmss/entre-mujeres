-- Orden de presentación.
--
-- Hasta ahora el orden en que se ven las comunidades y los productos era el orden del
-- arreglo en data/data.ts. Una tabla no tiene orden propio: sin un "order by" explícito
-- Postgres devuelve las filas como estén guardadas, y basta un update para que una fila
-- se reescriba al final y el sitio cambie de orden solo, sin que nadie haya tocado nada.
--
-- Esta columna lo vuelve un dato: el script de carga la llena con la posición que tiene
-- cada registro en data/data.ts, y las consultas ordenan por ella.

alter table public.communities add column orden int not null default 0;
alter table public.products    add column orden int not null default 0;
alter table public.events      add column orden int not null default 0;
alter table public.news        add column orden int not null default 0;

-- El desempate por slug deja el orden estable aunque dos filas compartan posición, que
-- es lo que pasa con las que se creen desde el panel sin asignarles una.
create index communities_orden_idx on public.communities (orden, slug);
create index products_orden_idx    on public.products (orden, slug);
