import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

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

  banUser() {
    return null;
  }

  unbanUser() {
    return null;
  }
}
function exclude(allUsers: Promise<{ id: string; createdAt: Date; updatedAt: Date; firstName: string; lastName: string; email: string; phoneNumber: string; password: string; role: import(".prisma/client").$Enums.Role; refreshToken: string; }[]>) {
  throw new Error('Function not implemented.');
}

