import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AuthService as AuthGRPCService,
  Credential,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../proto/auth';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthService implements AuthGRPCService {
  constructor(private userRepo: UserRepository) {}

  async Login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const user = await this.userRepo.getUserByEmail(request.email);
      if (request.password != user.password) {
        throw new UnauthorizedException('email or password is incorrect');
      }

      const credential = Credential.create({
        accessToken: 'abc',
        refreshToken: 'abc',
        accessTokenExpiresIn: 600,
        refreshTokenExpiresIn: 604800,
      });
      return LoginResponse.create({ credential });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  RefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return null;
  }
}
