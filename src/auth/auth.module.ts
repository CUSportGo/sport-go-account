import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
