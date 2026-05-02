import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import blogRoutes from "@/routes/blog.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);

export default router;