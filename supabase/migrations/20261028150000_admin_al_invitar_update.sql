-- Corrige cuándo se dispara el agregado automático a `admins`.
--
-- La versión anterior solo miraba el INSERT en auth.users, y ahí `invited_at` todavía
-- viene vacío: Supabase crea la fila primero y marca la invitación en un UPDATE
-- inmediatamente después. El resultado era que a la persona invitada no se la agregaba,
-- que es justo lo que el disparador venía a evitar. Se vio al probar el flujo completo:
-- el usuario quedaba con invited_at puesto pero sin fila en admins.
--
-- Ahora se escucha también el UPDATE de esa columna, así que da igual en qué orden lo
-- haga Supabase. El `on conflict do nothing` hace que disparar dos veces no moleste.

drop trigger if exists al_crear_usuario_invitado on auth.users;

create trigger al_crear_usuario_invitado
  after insert or update of invited_at on auth.users
  for each row execute function public.admin_al_invitar();

-- Emparejar lo que haya quedado fuera mientras el disparador no funcionaba.
insert into public.admins (user_id, nota)
select id, 'Invitada antes de que el disparador funcionara'
from auth.users
where invited_at is not null
on conflict (user_id) do nothing;
