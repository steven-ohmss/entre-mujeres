"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { localidadesConOtro } from "@/data/data";

const INITIATIVE_TYPES = [
  "Comunidad rural",
  "Productora",
  "Emprendimiento",
  "Servicio de apoyo",
] as const;

interface FormState {
  nombre: string;
  contacto: string;
  ubicacion: string;
  localidad: string;
  tipo: string;
  descripcion: string;
  productos: string;
  telefono: string;
  correo: string;
  redes: string;
}

const INITIAL_STATE: FormState = {
  nombre: "",
  contacto: "",
  ubicacion: "",
  localidad: "",
  tipo: "",
  descripcion: "",
  productos: "",
  telefono: "",
  correo: "",
  redes: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.nombre.trim()) errors.nombre = "Este campo es obligatorio.";
  if (!form.contacto.trim()) errors.contacto = "Este campo es obligatorio.";
  if (!form.ubicacion.trim()) errors.ubicacion = "Este campo es obligatorio.";
  if (!form.localidad) errors.localidad = "Selecciona una localidad.";
  if (!form.tipo) errors.tipo = "Selecciona un tipo de iniciativa.";
  if (!form.descripcion.trim()) errors.descripcion = "Este campo es obligatorio.";

  if (!form.telefono.trim()) {
    errors.telefono = "Este campo es obligatorio.";
  } else if (!/^\d{10}$/.test(form.telefono.trim())) {
    errors.telefono = "Ingresa un número de 10 dígitos.";
  }

  if (form.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
    errors.correo = "Ingresa un correo electrónico válido.";
  }

  return errors;
}

export default function JoinForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // TODO: conectar con un backend o servicio de formularios (por ejemplo, un endpoint propio,
    // Formspree o Google Sheets) para recibir y almacenar esta información de forma real.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="card p-8 text-center sm:p-10">
        <h3 className="font-serif text-2xl text-texto">¡Gracias!</h3>
        <p className="mt-3 text-sm leading-relaxed text-texto-suave">
          Recibimos tu información. Revisaremos tu iniciativa para incorporarla a la red.
        </p>
        <button type="button" onClick={handleReset} className="btn-primary mt-6">
          Enviar otra iniciativa
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      <div>
        <label htmlFor="nombre" className="field-label">
          Nombre de la comunidad u organización*
        </label>
        <input
          id="nombre"
          type="text"
          value={form.nombre}
          onChange={(event) => updateField("nombre", event.target.value)}
          className="field-input"
          aria-invalid={Boolean(errors.nombre)}
        />
        {errors.nombre ? <p className="field-error">{errors.nombre}</p> : null}
      </div>

      <div>
        <label htmlFor="contacto" className="field-label">
          Nombre de contacto*
        </label>
        <input
          id="contacto"
          type="text"
          value={form.contacto}
          onChange={(event) => updateField("contacto", event.target.value)}
          className="field-input"
          aria-invalid={Boolean(errors.contacto)}
        />
        {errors.contacto ? <p className="field-error">{errors.contacto}</p> : null}
      </div>

      <div>
        <label htmlFor="ubicacion" className="field-label">
          Ubicación (barrio, vereda o municipio)*
        </label>
        <input
          id="ubicacion"
          type="text"
          value={form.ubicacion}
          onChange={(event) => updateField("ubicacion", event.target.value)}
          className="field-input"
          aria-invalid={Boolean(errors.ubicacion)}
        />
        {errors.ubicacion ? <p className="field-error">{errors.ubicacion}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="localidad" className="field-label">
            Localidad*
          </label>
          <select
            id="localidad"
            value={form.localidad}
            onChange={(event) => updateField("localidad", event.target.value)}
            className="field-input"
            aria-invalid={Boolean(errors.localidad)}
          >
            <option value="">Selecciona una opción</option>
            {localidadesConOtro.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.localidad ? <p className="field-error">{errors.localidad}</p> : null}
        </div>

        <div>
          <label htmlFor="tipo" className="field-label">
            Tipo de iniciativa*
          </label>
          <select
            id="tipo"
            value={form.tipo}
            onChange={(event) => updateField("tipo", event.target.value)}
            className="field-input"
            aria-invalid={Boolean(errors.tipo)}
          >
            <option value="">Selecciona una opción</option>
            {INITIATIVE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.tipo ? <p className="field-error">{errors.tipo}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="field-label">
          Descripción*
        </label>
        <textarea
          id="descripcion"
          value={form.descripcion}
          onChange={(event) => updateField("descripcion", event.target.value)}
          rows={4}
          className="field-input"
          aria-invalid={Boolean(errors.descripcion)}
        />
        {errors.descripcion ? <p className="field-error">{errors.descripcion}</p> : null}
      </div>

      <div>
        <label htmlFor="productos" className="field-label">
          Productos o servicios
        </label>
        <textarea
          id="productos"
          value={form.productos}
          onChange={(event) => updateField("productos", event.target.value)}
          rows={3}
          className="field-input"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="field-label">
            Teléfono*
          </label>
          <input
            id="telefono"
            type="tel"
            inputMode="numeric"
            value={form.telefono}
            onChange={(event) => updateField("telefono", event.target.value)}
            className="field-input"
            aria-invalid={Boolean(errors.telefono)}
          />
          {errors.telefono ? <p className="field-error">{errors.telefono}</p> : null}
        </div>

        <div>
          <label htmlFor="correo" className="field-label">
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            value={form.correo}
            onChange={(event) => updateField("correo", event.target.value)}
            className="field-input"
            aria-invalid={Boolean(errors.correo)}
          />
          {errors.correo ? <p className="field-error">{errors.correo}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="redes" className="field-label">
          Redes sociales
        </label>
        <input
          id="redes"
          type="text"
          value={form.redes}
          onChange={(event) => updateField("redes", event.target.value)}
          className="field-input"
          placeholder="@usuario"
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          "Quiero ser parte"
        )}
      </button>
    </form>
  );
}
