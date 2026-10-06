import { z } from "zod";

export const createServiceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre es obligatorio"),

    description: z
      .string()
      .trim()
      .min(5, "La descripción es obligatoria"),

    duration: z
      .number({
        message: "La duración debe ser un número",
      })
      .positive("La duración debe ser mayor a 0"),

    price: z
      .number({
        message: "El precio debe ser un número",
      })
      .min(0, "El precio no puede ser negativo"),

    category: z
      .string()
      .trim()
      .min(2, "La categoría es obligatoria"),

    available: z.boolean({
     message: "available debe ser true o false",
        }),
  }),
});

export const updateServiceSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "El nombre no puede estar vacío")
        .optional(),

      description: z
        .string()
        .trim()
        .min(1, "La descripción no puede estar vacía")
        .optional(),

      duration: z
        .number({
          message: "La duración debe ser un número",
        })
        .positive("La duración debe ser mayor a 0")
        .optional(),

      price: z
        .number({
          message: "El precio debe ser un número",
        })
        .min(0, "El precio no puede ser negativo")
        .optional(),

      category: z
        .string()
        .trim()
        .min(1, "La categoría no puede estar vacía")
        .optional(),

      available: z
        .boolean({
          message: "available debe ser true o false",
        })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Debe enviar al menos un campo para actualizar",
    }),
});