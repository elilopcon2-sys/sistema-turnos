import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    clientName: z
      .string()
      .trim()
      .min(2, "El nombre del cliente es obligatorio"),

    clientEmail: z
      .string()
      .trim()
      .email("El correo electrónico no es válido"),

    date: z
      .string()
      .trim()
      .min(1, "La fecha es obligatoria"),

    time: z
      .string()
      .trim()
      .min(1, "La hora es obligatoria"),

    status: z
      .string()
      .trim()
      .min(1, "El estado es obligatorio"),
  }),
});

export const addServiceToBookingSchema = z.object({
  params: z.object({
    bid: z.coerce
      .number()
      .int("El ID de la reserva debe ser un entero")
      .positive("El ID de la reserva debe ser mayor a 0"),

    sid: z.coerce
      .number()
      .int("El ID del servicio debe ser un entero")
      .positive("El ID del servicio debe ser mayor a 0"),
  }),
});