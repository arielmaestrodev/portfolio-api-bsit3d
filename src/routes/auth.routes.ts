import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateSchema } from "@/middlewares/validate-schema.middleware";
import { loginSchema, signupSchema, verifyEmailSchema } from "@/schema/auth";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Role } from "@/generated/prisma";

const router = Router();
const authMiddleware = new AuthMiddleware();
const authController = new AuthController();

router.post("/v1/signup", validateSchema(signupSchema), authController.signup);
router.get("/v1/verify-email", validateSchema(verifyEmailSchema), authController.verifyEmail);
router.post("/v1/login", validateSchema(loginSchema), authController.login);

router.post("/v1/profile", authMiddleware.execute, permittedRole([Role.ADMIN]), (req, res) => {
  const result = { code: 200, status: "success", message: "Authenticated User!" };
  return res.status(result.code).json(result);
});

export default router;