import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse } from '../proto/auth';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<LoginResponse> {
    return this.authService.Login(request);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(request: LogoutRequest): Promise<LogoutResponse> {
    return this.authService.Logout(request);
  }
}
