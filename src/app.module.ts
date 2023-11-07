import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileModule } from './file/file.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
