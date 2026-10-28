-- Quien es invitado queda como administrador.
--
-- Invitar a alguien y además acordarse de agregarlo a mano a la tabla `admins` es un
-- paso que se olvida, y cuando se olvida la persona entra, ve "No tienes acceso" y no
-- entiende por qué. Este disparador lo resuelve: al crearse el usuario, se agrega solo.
--
-- SOBRE LA CONDICIÓN `invited_at is not null`:
--
-- El encargo decía que bastaba con disparar en cada usuario nuevo, porque hoy el
-- registro público está apagado y entonces todo usuario nuevo fue invitado. Es cierto
-- hoy. El problema es que esa premisa vive en una casilla del panel de Supabase, lejos
-- de este archivo: el día que alguien encienda "Allow new users to sign up" —para una
-- función de registro, por probar algo— cualquiera que cree una cuenta se volvería
-- administrador del sitio en ese instante, y nada avisaría.
--
-- `invited_at` solo lo llena Supabase cuando el usuario se creó por el flujo de
-- invitación. Mirarlo cuesta lo mismo y hace que la regla siga siendo correcta aunque
-- esa casilla cambie. El comportamiento que se pidió es idéntico: a quien se invita, se
-- le da acceso.

create or replace function public.admin_al_invitar()
returns trigger
language plpgsql
-- security definer: el disparador corre en nombre de quien crea el usuario, que no
-- tiene permiso para escribir en `admins` (su RLS no deja a nadie). Con definer corre
-- con los permisos del dueño de la función, que sí puede.
security definer
set search_path = public, pg_temp
as $$
begin
  if new.invited_at is not null then
    insert into public.admins (user_id, nota)
    values (new.id, 'Agregada automáticamente al aceptar la invitación')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario_invitado on auth.users;

create trigger al_crear_usuario_invitado
  after insert on auth.users
  for each row execute function public.admin_al_invitar();

-- Las invitaciones que ya se hayan enviado antes de esta migración no pasaron por el
-- disparador, así que se emparejan aquí. Sin esto habría que agregarlas a mano, que es
-- justo lo que esto viene a evitar.
insert into public.admins (user_id, nota)
select id, 'Invitada antes de que existiera el disparador'
from auth.users
where invited_at is not null
on conflict (user_id) do nothing;
