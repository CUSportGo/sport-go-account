import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  AuthServiceController,
  Credential,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth.pb';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';

@Injectable()
export class AuthService implements AuthServiceController {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      let user = await this.userRepo.getUserByEmail(request.email);
      if (!user) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'email or password is incorrect',
        });
      }
      const isPasswordMatch = await bcrypt.compare(
        request.password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'email or password is incorrect',
        });
      }

      const { accessToken, refreshToken } = await this.getTokens(user.id);
      user = await this.userRepo.updateRefreshToken(user.id, refreshToken);
      if (!user) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'internal server error',
        });
      }

      const credential: Credential = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpiresIn: 600,
        refreshTokenExpiresIn: 604800,
      };

      return { credential };
    } catch (err: any) {
      console.log(err);
      if (!(err instanceof RpcException)) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'internal server error',
        });
      }
      throw err;
    }
  }

  public async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return null;
  }

  private async getTokens(userId: string) {
    try {
      const accessToken = await this.jwtService.signAsync(
        {
          sub: userId,
          registeredClaims: {
            issuer: this.configService.get<string>('TOKEN_ISSUER'),
            expiredAt: Date.now() + 60 * 15,
            issuedAt: Date.now(),
          },
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      const refreshToken = await this.jwtService.signAsync(
        {
          sub: userId,
          registeredClaims: {
            issuer: '',
            expiredAt: Date.now() + 60 * 60 * 24 * 7,
            issuedAt: Date.now(),
          },
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '7d',
        },
      );

      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  public async logout(request: LogoutRequest): Promise<LogoutResponse> {

    const response: LogoutResponse = { isDone: true };
    return response;

  }

}
