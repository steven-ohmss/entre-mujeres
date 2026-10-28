# Entrar al panel: configuración e invitaciones

Esta guía es para quien administra el proyecto de Supabase. **No hay que saber
programar.** Los pasos 1 y 2 se hacen **una sola vez**; el paso 3 se repite cada vez que
entre alguien nuevo al equipo.

Nadie puede crearse una cuenta por su cuenta: en el sitio no hay registro. La única
manera de entrar es que alguien te invite.

---

## Cómo funciona, en una frase

Tú invitas a la persona desde Supabase → le llega un correo → al tocar el enlace, crea su
contraseña → de ahí en adelante entra con su correo y su contraseña en
`/iniciar-sesion`.

Quien es invitada queda con permiso de administradora **automáticamente**. No hay que
agregarla a ninguna lista a mano.

---

## Paso 1: las direcciones (una sola vez)

En el panel de Supabase, menú de la izquierda: **Authentication → URL Configuration**.

### Site URL

Es la dirección principal del sitio. Supabase la usa para armar los enlaces de los
correos.

```
https://entre-mujeres.vercel.app
```

> Va sin barra al final.

### Redirect URLs

Son las direcciones a las que Supabase tiene permiso de devolver a la persona después de
tocar el enlace del correo. Si una dirección no está en esta lista, el enlace no
funciona. Hay que agregar **las dos**, una por línea, con **Add URL**:

```
https://entre-mujeres.vercel.app/**
http://localhost:3000/**
```

| Línea | Para qué |
| --- | --- |
| `https://entre-mujeres.vercel.app/**` | El sitio publicado, el que usa el equipo |
| `http://localhost:3000/**` | El sitio corriendo en el computador de quien programa, para poder probar |

Los dos asteriscos del final significan "y cualquier dirección dentro de este sitio". Sin
ellos solo funcionaría la página de inicio.

Al terminar, toca **Save**.

---

## Paso 2: los correos, en español (una sola vez)

Los correos que manda Supabase vienen en inglés y con un enlace que **no sirve** para
este sitio. Hay que reemplazar dos.

Van en **Authentication → Emails** (en algunas versiones, *Email Templates*). Arriba hay
pestañas con el nombre de cada correo.

> **Lo más importante:** el enlace tiene que apuntar a `/auth/confirm`, que es la página
> que recibe a la persona y la deja entrar. Si se deja el enlace que viene por defecto,
> el correo lleva a una página que no existe.

### 2.1 Correo de invitación

Abre la pestaña **Invite user**.

En **Subject heading** pon:

```
Te damos la bienvenida a Entre mujeres
```

En **Message body**, borra todo lo que haya y pega esto:

```html
<h2>Te damos la bienvenida a Entre mujeres</h2>

<p>Hola:</p>

<p>
  Te invitamos a administrar el sitio de <strong>Entre mujeres</strong>, la plataforma
  de Red Mujer. Desde ahí vas a poder publicar y actualizar lo que se ve en la página.
</p>

<p>
  Para empezar, toca este botón y crea tu contraseña:
</p>

<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite"
    style="display:inline-block;background:#2F4A32;color:#FBF7F0;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;"
  >
    Crear mi contraseña
  </a>
</p>

<p style="color:#5B5B5B;font-size:14px;">
  Si el botón no funciona, copia y pega esta dirección en tu navegador:<br />
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite
</p>

<p style="color:#5B5B5B;font-size:14px;">
  Este enlace sirve una sola vez. Si no esperabas esta invitación, puedes ignorar
  este correo.
</p>
```

Toca **Save**.

### 2.2 Correo de "olvidé mi contraseña"

Abre la pestaña **Reset password**.

En **Subject heading** pon:

```
Recupera tu contraseña de Entre mujeres
```

En **Message body**, borra todo y pega esto. **Fíjate que aquí el final dice
`type=recovery`, no `type=invite`:**

```html
<h2>Recupera tu contraseña</h2>

<p>Hola:</p>

<p>
  Pediste crear una contraseña nueva para entrar al sitio de
  <strong>Entre mujeres</strong>. Toca este botón para elegirla:
</p>

<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery"
    style="display:inline-block;background:#2F4A32;color:#FBF7F0;padding:14px 28px;border-radius:999px;font-weight:600;text-decoration:none;"
  >
    Crear una contraseña nueva
  </a>
</p>

<p style="color:#5B5B5B;font-size:14px;">
  Si el botón no funciona, copia y pega esta dirección en tu navegador:<br />
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
</p>

<p style="color:#5B5B5B;font-size:14px;">
  Este enlace sirve una sola vez. Si no pediste cambiar tu contraseña, puedes ignorar
  este correo: tu contraseña actual sigue funcionando.
</p>
```

Toca **Save**.

> **Las llaves dobles no se tocan.** `{{ .SiteURL }}` y `{{ .TokenHash }}` son huecos que
> Supabase rellena solo al enviar cada correo. Si se borran o se cambian, el enlace deja
> de funcionar.

---

## Paso 3: invitar a una persona

1. En Supabase, entra a **Authentication → Users**.
2. Arriba a la derecha, toca el botón **Add user** y elige **Send invitation**
   (en algunas versiones el botón se llama directamente **Invite user**).
3. Escribe su **correo electrónico**. Revisa que esté bien escrito: el correo se va a
   enviar a esa dirección exacta y no hay forma de corregirlo después.
4. Toca **Send invitation**.
5. Avísale que le llegó un correo de Entre mujeres y que **revise también la carpeta de
   correo no deseado**, porque suele caer ahí la primera vez.

Eso es todo. Cuando ella toque el enlace y cree su contraseña, ya tiene acceso: el
permiso se le da solo.

### Si el enlace venció

Los enlaces de invitación sirven **una sola vez** y duran **24 horas**. Si pasó el
tiempo, simplemente invítala otra vez con los mismos pasos.

### Cómo quitarle el acceso a alguien

En **Authentication → Users**, busca a la persona, toca los tres puntos de su fila y
elige **Delete user**. Pierde el acceso de inmediato.

Si quieres que conserve la cuenta pero sin entrar al panel, abre **SQL Editor** y corre:

```sql
delete from public.admins
where user_id = (select id from auth.users where email = 'sucorreo@ejemplo.com');
```

---

## Paso 4: sobre los correos y sus límites

**Sí, el correo que viene con Supabase tiene un límite bajo.** Está pensado para probar,
no para usar de verdad:

| | Correo de Supabase | SMTP propio |
| --- | --- | --- |
| Cuántos correos | **Unos pocos por hora** (alrededor de 2 a 4) | Miles al mes |
| De quién llega | Una dirección de Supabase | `hola@tudominio.org` |
| Dónde cae | Con frecuencia en correo no deseado | En la bandeja de entrada |
| Si falla | Supabase no promete nada | El proveedor avisa |

**Para arrancar está bien.** Si el equipo son cuatro o cinco personas que se invitan una
vez, el correo de Supabase alcanza.

**Conviene cambiarlo cuando** pase cualquiera de estas cosas:

- Haya que invitar a varias personas el mismo día (con el límite por hora, la cuarta
  invitación simplemente no se envía y Supabase no siempre avisa con claridad).
- Alguien reporte que no le llegó el correo o que cayó en correo no deseado.
- El sitio empiece a mandar correos a las comunidades, no solo al equipo.

**Cómo se cambia, cuando llegue el momento:** en **Project Settings → Authentication →
SMTP Settings** se activa *Enable Custom SMTP* y se pegan los datos del proveedor.
Opciones gratuitas al empezar: **Resend** (3.000 correos al mes), **Brevo** (300 al día)
o **Mailgun**. Hace falta poder configurar el dominio de Red Mujer, así que es una
conversación con quien lo administre.

---

## Si algo sale mal

**«El enlace del correo ya venció o ya se usó»**
Es normal si pasó un día o si ya se tocó antes. Invítala de nuevo, o dile que use
"¿Olvidaste tu contraseña?" en `/iniciar-sesion`.

**El enlace del correo lleva a una página que no existe**
La plantilla no se guardó, o se guardó sin el `/auth/confirm`. Vuelve al paso 2.

**«No tienes acceso» después de entrar**
La cuenta existe pero no está en la lista de administradoras. Pasa si el usuario se creó
a mano con **Create user** en vez de con **Send invitation**: así no cuenta como
invitado. Lo más limpio es borrar ese usuario e invitarlo de nuevo.

**No llega ningún correo**
Casi siempre es el límite por hora del correo de Supabase (ver paso 4). Espera una hora
y prueba otra vez, o configura un SMTP propio.

**«Correo o contraseña incorrectos» y la contraseña es la correcta**
Revisa que el correo esté bien escrito, sin espacios al final. Si sigue, usa
"¿Olvidaste tu contraseña?".
