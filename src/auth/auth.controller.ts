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
  ValidateTokenRequest,
  ValidateTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  // ValidateGoogleRequest,
  // ValidateGoogleResponse,
  ValidateOAuthRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UpdateUserSportAreaResponse,
  UpdateUserSportAreaRequest,
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

  @GrpcMethod('AuthService', 'RefreshToken')
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(request);
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
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(request);
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(request);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    return this.authService.validateToken(request);
  }

  @GrpcMethod('AuthService', 'UpdateUserSportArea')
  updateUserSportArea(
    request: UpdateUserSportAreaRequest,
  ): Promise<UpdateUserSportAreaResponse> {
    return this.authService.updateUserSportArea(request);
  }
}
