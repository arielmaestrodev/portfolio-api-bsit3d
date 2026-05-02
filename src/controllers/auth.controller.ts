import { Request, Response } from "express";
import { signupUserServices, verifyEmailServices, LoginCredentialsService } from "@/services/auth";
import { TokenExpiry, toMilliseconds } from "@/lib/jwt";
import { ENV } from "@/config/env";

export class AuthController {
  // Helper to set cookies
  private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    const isProduction = ENV.NODE_ENV === "production";

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: toMilliseconds(TokenExpiry.ACCESS_TOKEN_EXPIRES),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: toMilliseconds(TokenExpiry.REFRESH_TOKEN_EXPIRES),
    });
  }

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

  // Handle Login Account
  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const result = await LoginCredentialsService(email, password);

    if (result.code === 200 && result.data?.tokens) {
      this.setAuthCookies(res, result.data.tokens);
    }

    return res.status(result.code).json(result);
  };
}