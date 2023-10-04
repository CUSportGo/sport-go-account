import { Injectable } from '@nestjs/common';
import { PrismaClient, Status, Blacklist } from '@prisma/client';
import { PrismaService } from '../prisma/service/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlacklistRepository {
    constructor(private db: PrismaService) { }

    async addOutdatedToken(outDatedToken: Prisma.BlacklistCreateInput): Promise<Blacklist> {
        return await this.db.blacklist.create({
            data: outDatedToken,
        })
    }
}
