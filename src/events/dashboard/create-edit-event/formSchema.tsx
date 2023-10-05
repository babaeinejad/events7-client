import { ExtendedEvnet7Types } from "events/types";
import { z } from "zod";

export const CreateEvent7FormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.nativeEnum(ExtendedEvnet7Types),
  priority: z.number().min(1).max(10),
});

export type Event7FormType = z.infer<typeof CreateEvent7FormSchema>;
