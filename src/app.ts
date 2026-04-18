import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "@/routes";
import { ENV } from "@/config/env";

const app = express();

// CORS Configuration
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: `${ENV.APP_NAME} instance is running...`,
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// Sample Get Endpoint
app.get("/api/sample/test", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Sample test endpoint is working...",
    timestamp: new Date().toISOString(),
  })
})

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  })
})

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error: ", err);

  const statusCode = err?.status || 500;
  const message = err?.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message: ENV.NODE_ENV === "production" ? "Internal Server Error" : message,
    stack: ENV.NODE_ENV !== "production" && err?.stack,
    timestamp: new Date().toISOString(),
  })
})

export default app;