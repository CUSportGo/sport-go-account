import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  register() {
    return this.userRepository.getUserByEmail('');
  }
}
