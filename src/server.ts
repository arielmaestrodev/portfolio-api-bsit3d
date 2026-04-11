import app from "@/app";
import { ENV } from "@/config/env";

const startServer = () => {
  try {
    app.listen(ENV.PORT, () => {
      console.log("---------------------------------");
      console.log(`${ENV.APP_NAME} started successfully!`);
      console.log(`URL: ${ENV.BACKEND_URL}`);
      console.log(`PORT: ${ENV.PORT}`);
      console.log(`ENVIRONMENT: ${ENV.NODE_ENV}`);
      console.log("---------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();