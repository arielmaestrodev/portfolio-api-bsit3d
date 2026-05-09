import { Router } from "express";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Role } from "@/generated/prisma";
import { validateSchema } from "@/middlewares/validate-schema.middleware";
import { createKnowledgeSchema } from "@/schema/ai/knowledge.schema";
import { KnowledgeBaseController } from "@/controllers/knowledgebase.controller";


const router = Router();
const authMiddleware = new AuthMiddleware();
const knowledgeBaseController = new KnowledgeBaseController();

router.post("/v1/create", authMiddleware.execute, permittedRole([Role.ADMIN]), validateSchema(createKnowledgeSchema), knowledgeBaseController.createKnowledge);

export default router;