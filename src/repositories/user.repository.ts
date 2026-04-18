import { prisma } from "@/lib/prisma";
import { SignupInput } from "@/schema/auth";

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findFirst({ where: { email } });
  }

  async create(data: SignupInput) {
    return await prisma.user.create({
      data,
      select: { id: true, name: true, email: true, createdAt: true, role: true, emailVerified: true },
    });
  }

  async findById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, role: true, emailVerified: true },
    });
  }

  async markEmailVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
      select: { id: true, email: true, emailVerified: true },
    });
  }
}