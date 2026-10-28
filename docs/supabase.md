# Supabase: cómo aplicar las migraciones y cargar los datos

Esta guía es para quien tenga acceso al proyecto de Supabase. Hay que hacerlo **una sola
vez**, y después solo se repite el paso 4 cada vez que cambie `data/data.ts`.

> **Importante:** el sitio **todavía no lee de Supabase.** La fuente que alimenta las
> páginas sigue siendo `data/data.ts`. Lo que se arma aquí es la base de datos cargada y
> lista; conectar el sitio es un paso aparte.

---

## Qué se crea

| Tabla | Qué guarda |
| --- | --- |
| `communities` | Las comunidades, con su punto en el mapa (`lat`/`lng`) y su contacto |
| `products` | Los productos, cada uno colgando de una comunidad |
| `product_images` | Las fotos de cada producto, con su descripción y su orden |
| `events` | El calendario |
| `news` | Las noticias e historias |
| `admins` | Quién puede escribir |

Más un bucket de archivos llamado `imagenes`.

**La regla de permisos es la misma en todo: cualquiera lee, solo los admins escriben.**
El sitio es público y se consulta sin iniciar sesión, así que la lectura está abierta;
lo que se protege es quién puede cambiar lo que se muestra.

---

## Paso 1: tener las claves en `.env.local`

El archivo ya existe en la raíz del proyecto, con las dos claves vacías. Hay que pegarlas
desde el panel de Supabase, en **Project Settings → API keys**:

| Variable del archivo | Qué clave va ahí |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la **publishable** |
| `SUPABASE_SERVICE_ROLE_KEY` | la **secret** |

`.env.local` está en `.gitignore`, así que las claves no salen de ese computador.

> La clave **secret** se salta todos los permisos. No se pega en ningún otro archivo, no
> se manda por chat y no se sube a ningún lado.

---

## Paso 2: aplicar las migraciones

Las cuatro migraciones están en `supabase/migrations/` y hay que aplicarlas **en orden**,
porque cada una se apoya en la anterior:

| Orden | Archivo | Qué hace |
| --- | --- | --- |
| 1 | `20261028120000_esquema.sql` | Crea los tipos y las cinco tablas de contenido |
| 2 | `20261028120100_admins.sql` | Crea la tabla `admins` y la función `is_admin()` |
| 3 | `20261028120200_rls.sql` | Activa los permisos de las cinco tablas |
| 4 | `20261028120300_bucket_imagenes.sql` | Crea el bucket y sus permisos |

Hay dos caminos. **Con hacer uno de los dos basta.**

### Camino A: el SQL Editor (más fácil, no hay que instalar nada)

1. Entra al panel de Supabase y abre **SQL Editor** en el menú de la izquierda.
2. Toca **New query**.
3. Abre `supabase/migrations/20261028120000_esquema.sql`, copia **todo** el contenido y
   pégalo en el editor.
4. Toca **Run** (o Ctrl+Enter). Debe decir *Success. No rows returned*.
5. Repite los pasos 2 a 4 con los otros tres archivos, **en el orden de la tabla**.

Si una consulta falla, no sigas con la siguiente: avisa con el mensaje de error completo.
Lo más probable es que se haya corrido dos veces (ver *Si algo sale mal*, abajo).

### Camino B: la CLI (mejor si se van a hacer más cambios)

Requiere node instalado, pero no hay que instalar la CLI: `npx` la baja sola.

```bash
# 1. Conectar la carpeta con el proyecto de Supabase.
#    El ref es lo que va en la URL: https://<ref>.supabase.co
npx supabase link --project-ref wwqxnfsfowhgdmzifaky

# 2. Ver qué se va a aplicar, sin aplicar nada
npx supabase db diff --linked

# 3. Aplicar las cuatro migraciones, en orden, de una sola vez
npx supabase db push
```

La CLI lleva la cuenta de cuáles ya corrieron, así que `db push` se puede repetir sin
volver a aplicar las mismas.

### Comprobar que quedó bien

En el SQL Editor:

```sql
-- Deben aparecer las seis tablas
select table_name from information_schema.tables
where table_schema = 'public' order by table_name;

-- Las cinco de contenido deben tener rowsecurity = true
select tablename, rowsecurity from pg_tables
where schemaname = 'public' order by tablename;

-- Debe existir el bucket, con public = true
select id, public from storage.buckets where id = 'imagenes';
```

---

## Paso 3: nombrar a los admins

Mientras nadie esté en la tabla `admins`, **nadie puede escribir desde el navegador**.
La carga del paso 4 no lo necesita, porque usa la clave secret, que se salta los
permisos. Esto hace falta solo cuando exista una pantalla de administración.

1. Esa persona tiene que tener cuenta en el proyecto (**Authentication → Users**). Si no
   la tiene, créala ahí con **Add user**.
2. Copia su `UID` de esa misma pantalla.
3. En el SQL Editor:

```sql
insert into public.admins (user_id, nota)
values ('pega-aquí-el-uid', 'Nombre de la persona')
on conflict (user_id) do nothing;
```

Para quitarle el permiso a alguien:

```sql
delete from public.admins where user_id = 'el-uid';
```

Borrarlo de `admins` **no borra su cuenta**: solo deja de poder escribir.

---

## Paso 4: cargar los datos y las imágenes

Este es el paso que se repite cada vez que cambie `data/data.ts`.

Primero, ver qué haría sin tocar nada. Esto funciona incluso antes de pegar las claves:

```bash
npm run supabase:cargar:seco
```

Si la lista se ve bien, cargar de verdad:

```bash
npm run supabase:cargar
```

Sube las 14 imágenes de `public/images/` al bucket y luego copia las 4 comunidades, los
7 productos con sus 7 fotos, los 2 eventos y la noticia.

**Se puede correr las veces que haga falta.** Todo va por *upsert* contra el slug de cada
fila y la ruta de cada archivo, así que la segunda corrida actualiza lo que cambió en vez
de duplicarlo. Si una foto desaparece de `data/data.ts`, su fila también se borra, para
que la base no se quede mostrando una foto que el sitio ya no usa.

Lo que el script **no** hace es borrar comunidades, productos, eventos ni noticias que
salgan de `data/data.ts`: eso se hace a mano, a propósito, para que una carga no se lleve
contenido por delante sin que nadie se dé cuenta.

### Cómo quedan las imágenes

El bucket replica la estructura de `public/images/`:

```
imagenes/
  productos/queso-campesino.jpg
  inicio/portada.jpg
  red-mujer.jpg
  …
```

En la base se guarda la ruta de adentro del bucket (`productos/queso-campesino.jpg`), sin
el nombre del bucket y sin la barra del principio.

> Hoy las fotos de comunidades y eventos todavía están sueltas en la raíz
> (`red-mujer.jpg`, `evento-1.jpg`), porque así están en `public/images/`. Cuando lleguen
> las fotos reales y se reorganicen en carpetas según `guia-material.md`, el bucket las
> va a reflejar solo.

---

## Si algo sale mal

**«type … already exists» o «relation … already exists»**
Esa migración ya se había aplicado. Los archivos están escritos para correr una sola vez.
Si hay que empezar de cero, en el SQL Editor:

```sql
drop table if exists public.product_images, public.products, public.events,
                     public.news, public.communities, public.admins cascade;
drop function if exists public.is_admin(), public.tocar_updated_at() cascade;
drop type if exists public.community_category, public.product_type, public.availability,
                    public.event_type, public.organizer, public.news_type,
                    public.localidad cascade;
```

> Esto **borra todo el contenido**. Solo tiene sentido mientras la base esté recién
> hecha y lo único que haya adentro sea lo que carga el paso 4.

**«new row violates row-level security policy»**
Se está escribiendo con la clave publishable en lugar de la secret, o con un usuario que
no está en `admins`.

**«Faltan las variables de entorno»**
Las claves no están pegadas en `.env.local`, o el script se corrió sin `--env-file`. Usar
siempre `npm run supabase:cargar`, que ya lo incluye.

**«invalid input value for enum»**
Un valor no coincide exactamente con la lista permitida, casi siempre por una tilde. Los
enums están en la primera migración.
