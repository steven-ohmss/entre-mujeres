# Paso 4: Iniciar sesión, invitaciones y /admin

Contexto: el sitio ya lee de Supabase (paso 3). La tabla `admins` existe y la función `is_admin()` controla quién puede escribir. El registro público ya está desactivado en Supabase ("Allow new users to sign up" apagado). Ahora hay que construir el inicio de sesión por invitación y la ruta protegida `/admin`.

## Flujo que debe funcionar

1. Nosotros invitamos a la persona desde el dashboard de Supabase (Authentication → Users → Invite user).
2. Ella recibe un correo con un enlace seguro.
3. El enlace la lleva a `/auth/confirm` (usar `verifyOtp` con `token_hash`, para los tipos `invite` y `recovery`) y de ahí a `/definir-contrasena`.
4. En `/definir-contrasena` crea su contraseña (mínimo 8 caracteres, con campo de confirmación) y entra a `/admin`.
5. De ahí en adelante entra desde `/iniciar-sesion` con su correo y su contraseña.

## Qué construir

- Usar `@supabase/ssr` con cookies (cliente de navegador y de servidor).
- Proteger `/admin` y todo lo que esté debajo con la convención de middleware/proxy de la versión de Next instalada:
  - Sin sesión → redirigir a `/iniciar-sesion`.
  - Con sesión pero sin estar en `admins` → mostrar "No tienes acceso" con un botón para cerrar sesión.
- `/iniciar-sesion`:
  - Correo y contraseña, con mensajes de error claros en español ("Correo o contraseña incorrectos", etc.).
  - Enlace "¿Olvidaste tu contraseña?" que envía un correo de recuperación y usa el mismo flujo de `/auth/confirm` → `/definir-contrasena`.
- `/definir-contrasena`: solo accesible con una sesión válida que viene del enlace del correo.
- Agregar automáticamente a la tabla `admins` a quien se invita. Como el registro público está desactivado, todo usuario creado fue invitado, así que un trigger al crear el usuario en `auth.users` es válido. Va como una nueva migración en `supabase/migrations/`. Si propones otra forma, explícamela antes.
- Agregar a la tabla `admins` mi usuario cuando yo me invite a mí mismo (el trigger lo resuelve).
- Enlace visible "Iniciar sesión":
  - En el header, en lugar de "Cuenta de usuario – Próximamente".
  - En el footer.
  - Con sesión iniciada, mostrar "Panel" (lleva a `/admin`) y "Cerrar sesión".
- `/admin` por ahora es una página de bienvenida ("Hola, [correo]") con las secciones que vendrán en el paso 5 (Comunidades, Productos, Eventos, Noticias) como tarjetas deshabilitadas o "Próximamente".
- Mismo estilo del sitio, textos grandes y botones de 48 px, pensado para personas sin experiencia técnica.
- Nunca usar la clave secret en el navegador.

## Lo que necesito que me digas al final (como lista de pasos, para alguien que no conoce Supabase)

1. Qué poner en **Authentication → URL Configuration**:
   - Site URL.
   - Redirect URLs (localhost:3000 y el dominio de Vercel: https://entre-mujeres.vercel.app).
2. Cómo cambiar las plantillas de correo de **Invite user** y **Reset password**:
   - En español.
   - Con el enlace correcto hacia `/auth/confirm` usando `{{ .SiteURL }}`, `{{ .TokenHash }}` y el `type` correspondiente.
   - Dame el texto completo de cada plantilla listo para copiar y pegar.
3. Cómo invitar a una persona paso a paso.
4. Si el correo de Supabase por defecto tiene límites de envío y si conviene configurar un SMTP propio más adelante.

## Al terminar

- Aplica la nueva migración (si la CLI pide algo interactivo, dime el comando y lo corro yo en otra terminal).
- Pruébalo de punta a punta con un correo de prueba: invitar → correo → definir contraseña → entrar a /admin → cerrar sesión → volver a entrar → recuperar contraseña.
- Haz commit y confirma con `npm run build`.
