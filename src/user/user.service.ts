import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { Status } from '@prisma/client';
import {
  UserServiceController,
  GetUserSportAreaRequest,
  GetUserSportAreaResponse,
  GetUserProfileRequest,
  GetUserProfileResponse,
} from './user.pb';
import { SportAreaListRepository } from '../repository/sportAreaList.repository';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { FileService } from 'src/file/file.service';
import { use } from 'passport';

@Injectable()
export class UserService implements UserServiceController {
  constructor(
    private userRepo: UserRepository,
    private sportAreaListRepo: SportAreaListRepository,
    private fileService: FileService,
  ) { }

  findAllUsers() {
    try {
      const allUsers = this.userRepo.getAllUsers();
      return allUsers;
    } catch (e) {
      console.log(e);
      throw InternalServerErrorException;
    }
  }

  async banUser(userId: string) {
    try {
      const user = await this.userRepo.findUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if (user.status === Status.BANNED) {
        return this.userRepo.exclude(user, ['password', 'refreshToken']);
      }
      const bannedUser = await this.userRepo.update(userId, {
        status: Status.BANNED,
      });
      return this.userRepo.exclude(bannedUser, ['password', 'refreshToken']);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async unbanUser(userId: string) {
    try {
      const user = await this.userRepo.findUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if (user.status === Status.ACTIVE) {
        return this.userRepo.exclude(user, ['password', 'refreshToken']);
      }
      const bannedUser = await this.userRepo.update(userId, {
        status: Status.ACTIVE,
      });
      return this.userRepo.exclude(bannedUser, ['password', 'refreshToken']);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getUserSportArea(
    request: GetUserSportAreaRequest,
  ): Promise<GetUserSportAreaResponse> {
    try {
      const userSportArea = await this.sportAreaListRepo.findUserSportArea(
        request.sportAreaId,
      );
      if (!userSportArea) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Not found sport area',
        });
      }
      return {
        userId: userSportArea.userId,
        sportAreaId: userSportArea.SportAreaId,
      };
    } catch (err: any) {
      console.log(err);
      if (!(err instanceof RpcException)) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'internal server error',
        });
      }
      throw err;
    }
  }

  async getUserProfile(request: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    try {
      const userId = request.userId
      let user = await this.userRepo.findUserById(userId);
      let userSportArea = await this.sportAreaListRepo.findSportAreaByUser(userId)
      const photoURL = ((user.photoURL == null) ? (await this.fileService.getSignedUrl({ filename: user.photoFileName, userId: userId })).url : user.photoURL)
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileUrl: photoURL,
        role: user.role,
        sportAreaId: ((userSportArea == null) ? null : userSportArea.SportAreaId),
      }

    } catch (err: any) {
      console.log(err);
      if (!(err instanceof RpcException)) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'internal server error cant get user profile',
        });
      }
      throw err;
    }
  }
}
