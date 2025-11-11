import z from "zod";

const createSpecialitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().optional(),
});

export const SpecialitiesValidation = {
  createSpecialitySchema,
};
