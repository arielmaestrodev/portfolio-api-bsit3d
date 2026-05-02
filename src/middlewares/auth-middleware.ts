import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";

type AuthenticatedRequest = Request & { user?: JwtPayload };

export class AuthMiddleware {
  public execute = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    // 1. Try to get token from Authorization Header
    let accessToken = this.extractBearerToken(req.headers.authorization);

    // 2. Fallback to Cookies (for Web applications)
    if (!accessToken && req.cookies) {
      accessToken = req.cookies.accessToken;
    }

    // 3. Token Verification
    if (!accessToken) {
      return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    }

    // 4. Token Validation & Extraction
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return res.status(401).json({ code: 401, status: "error", message: "Invalid or expired token" });
    }

    // 5. Attach user to request
    authReq.user = payload;
    next();
  }

  private extractBearerToken(header?: string) {
    if (!header) return undefined;
    const [scheme, token] = header.split(" ");
    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return undefined;
    return token.trim();
  }
}