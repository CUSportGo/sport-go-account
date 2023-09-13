import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequest, LoginResponse } from '../proto/auth';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<LoginResponse> {
    console.log(request);
    return this.authService.Login(request);
  }
}
