import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from 'src/repository/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SportAreaListRepository } from '../repository/sportAreaList.repository';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, SportAreaListRepository],
})
export class UserModule { }
