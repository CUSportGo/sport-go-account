import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateOAuthRequest,
} from './auth.pb';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @GrpcMethod('AuthService', 'Register')
  registerUser(request: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(request);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(request: LogoutRequest): Promise<LogoutResponse> {
    return this.authService.logout(request);
  }

  @GrpcMethod('AuthService', 'ValidateOAuth')
  validateOAuth(request: ValidateOAuthRequest): Promise<LoginResponse> {
    return this.authService.validateOAuth(request);
  }

  @GrpcMethod('AuthService', 'ForgotPassword')
  forgotPassword(
    request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(request)
  }
}
