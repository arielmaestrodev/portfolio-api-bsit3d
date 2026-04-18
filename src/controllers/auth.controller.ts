import { Request, Response } from "express";
import { signupUserServices, verifyEmailServices } from "@/services/auth";

export class AuthController {
  // Signup Method
  public signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body ?? {};
    const result = await signupUserServices({ name, email, password });
    return res.status(result.code).json(result);
  }

  // Verify Email Method
  public verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query ?? {};
    const result = await verifyEmailServices(token as string);
    return res.status(result.code).json(result);
  }
}