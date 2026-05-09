import { KnowledgeBaseRepository } from "@/repositories/knowledgebase.repository";
import { generateEmbedding, generateChatResponse } from "@/services/ai/core/gemini-service";
import { Content } from "@google/generative-ai";

export async function AskAIService(question: string, history: Content[] = []) {
  const knowledgeBaseRepository = new KnowledgeBaseRepository();

  try {
    // 1. Generate embedding for the question
    const embedding = await generateEmbedding(question);
    const vectorStr = `[${embedding.join(",")}]`;

    // 2. Search for similar context in both repositories
    const [relevantKnowledgeBase] = await Promise.all([
      knowledgeBaseRepository.searchSimilar(vectorStr, 3)
    ]);


    // 3. Format combined context
    let context = "";

    if (relevantKnowledgeBase.length > 0) {
      context += "Knowledge Base Info:\n" + relevantKnowledgeBase.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join("\n\n") + "\n\n";
    }

    if (!context) {
      context = "No specific knowledge found in the database.";
    }

    // 4. Generate AI response
    const answer = await generateChatResponse(question, context, history);

    return {
      code: 200,
      status: "success",
      data: {
        answer,
        sources: [
          ...relevantKnowledgeBase.map((k: any) => ({ type: "kb", title: k.question, distance: k.distance }))
        ]
      },
    };

  } catch (error) {
    console.error("AskAIService Error", error);
    return { code: 500, status: "error", message: "AI assistant is currently unavailable" };
  }
}