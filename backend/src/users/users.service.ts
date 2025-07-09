import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      // Incluir password para validación de autenticación
    });
  }

  async create(userData: {
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    password: string;
    role?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role as any || 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
      },
    });
  }

  async update(id: string, userData: any) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
} 