import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AuthService as AuthGRPCService,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../proto/auth';

@Injectable()
export class AuthService implements AuthGRPCService {
  @GrpcMethod('AuthtService', 'Login')
  Login(request: LoginRequest): Promise<LoginResponse> {
    return null;
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  RefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return null;
  }
}
