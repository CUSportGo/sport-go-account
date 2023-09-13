import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [AuthService, UserRepository, AccessTokenStrategy, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
