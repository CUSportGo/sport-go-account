import { Injectable } from '@nestjs/common';
import { PrismaClient, Status, SportArea } from '@prisma/client';
import { PrismaService } from '../prisma/service/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateUserSportAreaRequest } from 'src/auth/auth.pb';
import { UserRepository } from './user.repository';

@Injectable()
export class SportAreaListRepository {
  constructor(private db: PrismaService) { }

  async addSportArea(
    updateInfo: UpdateUserSportAreaRequest,
  ): Promise<SportArea> {
    return await this.db.sportArea.create({
      data: {
        SportAreaId: updateInfo.sportAreaId,
        user: { connect: { id: updateInfo.userId } },
      },
    });
  }

  async findUserSportArea(sportAreaId: string): Promise<SportArea> {
    return await this.db.sportArea.findFirst({
      where: { SportAreaId: sportAreaId },
    });
  }

  async findSportAreaByUser(userId: string): Promise<SportArea> {
    return await this.db.sportArea.findFirst({
      where: {
        userId: userId
      }
    })
  }
}
