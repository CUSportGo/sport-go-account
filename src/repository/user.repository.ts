import { Injectable } from '@nestjs/common';
import { PrismaClient, Status, User } from '@prisma/client';
import { PrismaService } from '../prisma/service/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private db: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.db.user.findUnique({ where: { email: email } });
  }

  async create(createUser: Prisma.UserCreateInput): Promise<User> {
    return await this.db.user.create({
      data: createUser,
    });
  }

  async findUserById(userId: string): Promise<User> {
    return await this.db.user.findUnique({
      where: { id: userId },
    });
  }

  async update(
    userId: string,
    updateUser: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.db.user.update({
      where: { id: userId },
      data: updateUser,
    });
  }

  async getAllUsers(): Promise<object[]> {
    return this.db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        password: false,
        refreshToken: false,
        status: true,
      },
    });
  }

  exclude<Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<User, Key>;
  }
}
