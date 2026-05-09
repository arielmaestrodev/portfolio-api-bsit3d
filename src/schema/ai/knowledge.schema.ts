import { z } from "zod";

export const createKnowledgeSchema = z.object({
  body: z.object({
    question: z.string().min(5, "Question must be at least 5 characters"),
    answer: z.string().min(10, "Answer must be at least 10 characters"),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});