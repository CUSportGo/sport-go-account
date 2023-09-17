import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequest, LoginResponse } from './auth.pb';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }
}
