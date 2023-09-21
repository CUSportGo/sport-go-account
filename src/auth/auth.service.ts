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
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.pb';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';

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
      user = await this.userRepo.update(user.id, { refreshToken: refreshToken });
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


  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const existUser = await this.userRepo.getUserByEmail(request.email);
      if (existUser) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'Duplicate Email',
        });
      } else {
        const hashedPassword = await bcrypt.hash(request.password, 12);
        const newUser = {
          id: uuidv4(),
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phoneNumber: request.phoneNumber,
          role: request.role == 'USER' ? Role.USER : Role.SPORTAREA,
          password: hashedPassword,
        };
        return await this.userRepo.create(newUser);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}
