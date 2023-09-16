import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterRequest, RegisterResponse } from 'src/proto/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'Register')
  registerUser(request: RegisterRequest): Promise<RegisterResponse> {
    return this.userService.register(request);
  }
}
