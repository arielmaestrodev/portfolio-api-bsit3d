import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";
import { generateEmbedding } from "@/services/ai/core/gemini-service";

interface CreateKnowledgeBaseData {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  metadata?: any;
}

export async function CreateKnowledgeBaseService(data: CreateKnowledgeBaseData) {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();

  try {
    const embedding = await generateEmbedding(`${data.question}\n${data.answer}`);
    const vectorStr = `[${embedding.join(",")}]`;

    await knowledgeBaseRepository.create({
      ...data,
      embedding: vectorStr,
    });

    return {
      code: 201,
      status: "success",
      message: "Knowledge base entry created successfully",
    };
  } catch (error) {
    return { code: 500, status: "error", message: "Unable to create knowledge base entry" };
  }
}