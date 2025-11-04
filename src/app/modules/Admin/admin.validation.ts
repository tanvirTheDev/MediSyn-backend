import z from "zod";

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    contactNumber: z.string().optional(),
  }),
});

export const adminZodValidation = {
  updateSchema,
};
