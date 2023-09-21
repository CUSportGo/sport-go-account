import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) { }

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
      if(!user){
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if(user.status === Status.BANNED){
        return this.userRepo.exclude(user, ['password', 'refreshToken']);;
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

  unbanUser() {
    return null;
  }
}

