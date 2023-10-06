import { z } from "zod";

export const requiredErrorMessage = "This field is required.";
export const CreateEvent7FormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: requiredErrorMessage }),
  description: z.string().min(1, { message: requiredErrorMessage }),
  type: z.string().min(1, { message: requiredErrorMessage }),
  priority: z.number().min(1).max(10),
});

export type Event7FormType = z.infer<typeof CreateEvent7FormSchema>;
