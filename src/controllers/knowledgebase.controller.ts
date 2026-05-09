import { Request, Response } from "express";
import { CreateKnowledgeBaseService } from "@/services/ai/knowledge-base/create-knowledge-base-service";

export class KnowledgeBaseController {
  // Create Knowledge
  public createKnowledge = async (req: Request, res: Response) => {
    const data = req.body;
    const result = await CreateKnowledgeBaseService(data);
    return res.status(result.code).json(result);
  };
}