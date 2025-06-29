import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario
   */
  async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...userData,
      role: userData.role || UserRole.USER,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Encuentra usuario por ID
   */
  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  /**
   * Encuentra usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Actualiza último login
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLogin: new Date(),
      failedLoginAttempts: 0,
    });
  }

  /**
   * Incrementa intentos fallidos de login
   */
  async incrementFailedAttempts(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (user) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const isBlocked = failedAttempts >= 5;
      
      await this.userRepository.update(user.id, {
        failedLoginAttempts: failedAttempts,
        isBlocked,
        blockedUntil: isBlocked ? new Date(Date.now() + 3600000) : null, // 1 hora
      });
    }
  }

  /**
   * Desbloquea usuario
   */
  async unblockUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isBlocked: false,
      failedLoginAttempts: 0,
      blockedUntil: null,
    });
  }

  /**
   * Actualiza contraseña
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: newPassword,
      lastPasswordChange: new Date(),
    });
  }

  /**
   * Obtiene todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'isActive', 'lastLogin', 'createdAt'],
    });
  }

  /**
   * Actualiza usuario
   */
  async update(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, updateData);
    return await this.findById(userId);
  }

  /**
   * Elimina usuario (soft delete)
   */
  async delete(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isActive: false,
      deletedAt: new Date(),
    });
  }
} 