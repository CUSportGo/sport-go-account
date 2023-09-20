import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  findAllUsers() {
    return null;
  }

  banUser() {
    return null;
  }

  unbanUser() {
    return null;
  }
}
