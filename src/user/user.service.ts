import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import {
  UserService as UserGRPCService,
  RegisterRequest,
  RegisterResponse,
} from '../proto/user';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService implements UserGRPCService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const existUser = this.userRepository.findUnique({
        email: request.email,
      });
      if (existUser) {
        throw new BadRequestException('Duplicate email');
      } else {
        const hashedPassword = await bcrypt.hash(request.password, 12);
        const newUser = {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phoneNumber: request.phoneNumber,
          role: request.role,
          password: hashedPassword,
        };
        return await this.userRepository.create(newUser);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
