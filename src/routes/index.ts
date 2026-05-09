import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import blogRoutes from "@/routes/blog.routes";
import knowledgeBaseRoutes from "@/routes/knowledgebase.routes";
import aiRoutes from "@/routes/ai.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);
router.use("/knowledgebase", knowledgeBaseRoutes);
router.use("/ai", aiRoutes);

export default router;