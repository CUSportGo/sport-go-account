import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateGoogleRequest,
  ValidateGoogleResponse,
} from './auth.pb';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @GrpcMethod('AuthService', 'Register')
  registerUser(request: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(request);
  }

  @GrpcMethod('AuthService', 'ValidateGoogle')
  validateGoogle(
    request: ValidateGoogleRequest,
  ): Promise<ValidateGoogleResponse> {
    return this.authService.validateGoogle(request);
  }
}
