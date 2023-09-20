import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/service/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private db: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.db.user.findUnique({ where: { email: email } });
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

  async create(createUser): Promise<User> {
    return await this.db.user.create({
      data: {
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        email: createUser.email,
        phoneNumber: createUser.phoneNumber,
        password: createUser.password,
        role: 'USER',
      },
    });
  }
}
