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

  const ruta = request.nextUrl.pathname;

  const irA = (pathname: string, parametros?: Record<string, string>) => {
    const destino = request.nextUrl.clone();
    destino.pathname = pathname;
    destino.search = "";
    for (const [k, v] of Object.entries(parametros ?? {})) destino.searchParams.set(k, v);
    return NextResponse.redirect(destino);
  };

  // --- Definir la contraseña: hace falta una sesión, cualquiera ---------------
  //
  // La sesión la crea /auth/confirm al canjear el enlace del correo. Quien llegue por su
  // cuenta y sin sesión no tiene a quién cambiarle la contraseña.
  if (ruta === "/definir-contrasena") {
    if (!user) return irA("/iniciar-sesion", { error: "sin-sesion" });
    return respuesta;
  }

  // --- El aviso de "no tienes acceso" ----------------------------------------
  if (ruta === "/sin-acceso") {
    if (!user) return irA("/iniciar-sesion");
    // Si en el entretanto sí le dieron permiso, que entre en vez de quedarse atascada.
    const { data: yaEsAdmin } = await supabase.rpc("is_admin");
    if (yaEsAdmin === true) return irA("/admin");
    return respuesta;
  }

  // --- El panel ---------------------------------------------------------------

  if (!user) {
    // Con "volver" para devolverla a donde iba después de entrar.
    return irA("/iniciar-sesion", { volver: ruta });
  }

  // Hay sesión, pero ¿tiene permiso? Lo responde la base con is_admin(), que devuelve sí
  // o no sin enseñar la lista de administradores. Es una consulta más por visita al
  // panel, y vale la pena: es lo que evita que el panel se arme para quien no debe verlo.
  const { data: esAdmin } = await supabase.rpc("is_admin");

  if (esAdmin !== true) return irA("/sin-acceso");

  return respuesta;
}

export const config = {
  /**
   * Las tres rutas cuyo contenido depende de quién entra.
   *
   * Van aquí y no dentro de sus páginas porque con el render parcial de esta versión el
   * HTML empieza a enviarse antes de que un `redirect()` de página alcance a actuar: la
   * respuesta salía con 200 y el encabezado ya puesto, y quien no debía verlo alcanzaba a
   * leer un parpadeo antes de que el navegador lo sacara. Desde aquí es una redirección
   * de verdad, antes de renderizar nada.
   *
   * Las páginas públicas siguen fuera: son estáticas y no deben volverse dinámicas por
   * mirar una cookie que no necesitan.
   */
  matcher: ["/admin/:path*", "/definir-contrasena", "/sin-acceso"],
};
