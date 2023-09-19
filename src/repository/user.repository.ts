import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/service/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private db: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.db.user.findUnique({ where: { email: email, googleID: null } });
  }

  async getUserByGoogleID(googleID: string): Promise<User> {
    return this.db.user.findUnique({ where: { googleID: googleID } });
  }

  async create(user: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({ data: user });
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
