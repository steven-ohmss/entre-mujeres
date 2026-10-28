-- Bucket de imágenes: lectura pública, subir y borrar solo admins.
--
-- Un solo bucket con carpetas por tipo, siguiendo la organización que ya propone
-- docs/guia-material.md:
--
--   imagenes/
--     inicio/        portada.jpg
--     comunidades/   red-mujer.jpg, manos-de-usme.jpg, …
--     productos/     queso-campesino.jpg, yogurt-griego.jpg, …
--     eventos/       feria-campesina-usme.jpg, …
--     noticias/      historia-red-mujer.jpg, …
--
-- La ruta que se guarda en image_path / storage_path es la de adentro del bucket,
-- sin el nombre del bucket: "productos/queso-campesino.jpg".

-- public = true: los archivos se sirven por una URL directa, sin firmar y sin pedir
-- sesión, que es lo que necesita un sitio público para que las fotos carguen rápido.
-- Lo que sigue protegido es quién puede subirlas y borrarlas.
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do update set public = excluded.public;

-- Las políticas van sobre storage.objects, que es donde Supabase guarda un registro por
-- archivo. Cada una se limita a este bucket: sin el filtro por bucket_id se estarían
-- abriendo también los demás.

create policy "imagenes: lectura pública"
  on storage.objects for select
  using (bucket_id = 'imagenes');

create policy "imagenes: suben admins"
  on storage.objects for insert
  with check (bucket_id = 'imagenes' and public.is_admin());

create policy "imagenes: reemplazan admins"
  on storage.objects for update
  using (bucket_id = 'imagenes' and public.is_admin())
  with check (bucket_id = 'imagenes' and public.is_admin());

create policy "imagenes: borran admins"
  on storage.objects for delete
  using (bucket_id = 'imagenes' and public.is_admin());
