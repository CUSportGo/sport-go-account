import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/service/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private db: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return await this.db.user.findUniqueOrThrow({ where: { email: email } });
  }

  async findUnique(where, select?, include?): Promise<User> {
    return await this.db.user.findUnique({ where: where });
  }

  async create(data): Promise<User> {
    return await this.db.user.create({ data: data });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    return await this.db.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });
  }
}
