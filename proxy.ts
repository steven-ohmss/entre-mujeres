import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Se ejecuta antes de que se dibuje cualquier página de /admin.
 *
 * Refresca la sesión y decide quién pasa. Las dos comprobaciones van aquí, y no dentro
 * de las páginas, por una razón concreta: con el render parcial de esta versión de Next,
 * el layout y la página de adentro se arman a la vez y el HTML empieza a enviarse antes
 * de que el layout termine. Un `redirect()` en el layout llega tarde: el navegador
 * obedece, pero el contenido del panel ya viajó en la respuesta. Se vio al probarlo.
 *
 * Aquí no: esto corre antes de que se renderice nada, así que quien no pasa recibe una
 * redirección de verdad y ni un byte del panel.
 *
 * Lo de refrescar importa igual. Los tokens de Supabase vencen cada pocos minutos, y si
 * nadie los renueva la persona se ve expulsada del panel mientras trabaja.
 *
 * En Next 16 este archivo se llama proxy.ts: la convención `middleware` quedó deprecada
 * y se renombró para dejar claro que corre en el borde de la red, antes del render.
 */
export async function proxy(request: NextRequest) {
  // La respuesta se va construyendo para poder escribirle las cookies renovadas.
  let respuesta = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sin configuración no se puede comprobar nada. Se deja pasar: la página de /admin
  // fallará con su propio mensaje, en vez de dejar a todo el mundo fuera sin explicación.
  if (!url || !clave) return respuesta;

  const supabase = createServerClient(url, clave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(aGuardar) {
        for (const { name, value } of aGuardar) {
          request.cookies.set(name, value);
        }
        respuesta = NextResponse.next({ request });
        for (const { name, value, options } of aGuardar) {
          respuesta.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() y no getSession(): valida el token contra Supabase en vez de creerle a la
  // cookie. También es lo que dispara la renovación.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/iniciar-sesion";
    // Para devolverla a donde iba después de entrar.
    destino.searchParams.set("volver", request.nextUrl.pathname);
    return NextResponse.redirect(destino);
  }

  // Hay sesión, pero ¿tiene permiso? Lo responde la base con is_admin(), que devuelve sí
  // o no sin enseñar la lista de administradores. Es una consulta más por visita al
  // panel, y vale la pena: es lo que evita que el panel se arme para quien no debe verlo.
  const { data: esAdmin } = await supabase.rpc("is_admin");

  if (esAdmin !== true) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/sin-acceso";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

export const config = {
  // Solo el panel. Las páginas públicas no pasan por aquí: son estáticas y no deben
  // volverse dinámicas por mirar una cookie que no necesitan.
  matcher: ["/admin/:path*"],
};
