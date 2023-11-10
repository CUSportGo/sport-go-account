import { Inject, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BlacklistRepository } from 'src/repository/blacklist.repository';

import { SportAreaListRepository } from 'src/repository/sportAreaList.repository';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.EMAIL_SERVICE_RMQ],
          queue: process.env.EMAIL_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    FileModule,
  ],
  providers: [
    AuthService,
    UserRepository,
    AccessTokenStrategy,
    ConfigService,
    BlacklistRepository,
    SportAreaListRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
