import crypto from "crypto";
import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";
import { SignupInput } from "@/schema/auth";
import { hashPassword } from "@/utils/password-hashing";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

export async function signupUserServices(input: SignupInput) {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  try {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // expires after 24hrs

    // Check if email is existing
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      return { code: 409, status: "error", message: "Email already registered" };
    }

    // Insert User Account
    const created = await userRepository.create({ name: input.name, email: input.email, password: hashPassword(input.password) });

    // Insert Email Verification Token
    await tokenRepository.createEmailVerificationToken({ userId: created.id, token, expiresAt });

    // Updated path to include /api/auth/v1 for backend testing
    const emailVerificationURL = `${process.env.BACKEND_URL}/api/auth/v1/verify-email?token=${encodeURIComponent(token)}`;

    // Format Email HTML
    const html = renderTemplate("verify-email.html", {
      name: created.name ?? "there",
      emailVerificationURL,
      expiresAt: expiresAt.toUTCString(),
    });

    // Send Email Verification
    await sendEmail({
      to: created.email ?? input.email,
      subject: "Verify your email address",
      html,
    });

    // Success message
    return {
      code: 200,
      status: "success",
      message: "Created account successfully! Please verify your email.",
      data: { user: created },
    };

  } catch (error) {
    console.error("SignupUserService error", error);
    return { code: 500, status: "error", message: "Unable to create account" };
  }
}