import { Inject, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { ConfigService } from '@nestjs/config';
import { BlacklistRepository } from 'src/repository/blacklist.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [PrismaModule, JwtModule.register({}), ClientsModule.register([{
    name: 'EMAIL_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'email_queue',
      queueOptions: {
        durable: false
      }
    }
  }])],
  providers: [AuthService, UserRepository, AccessTokenStrategy, ConfigService, BlacklistRepository],
  controllers: [AuthController],
})
export class AuthModule { }
