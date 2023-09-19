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
  ValidateGoogleRequest,
  ValidateGoogleResponse,
} from './auth.pb';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GrpcInternalException } from 'nestjs-grpc-exceptions';
import { $Enums, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements AuthServiceController {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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

  public async validateGoogle(
    request: ValidateGoogleRequest,
  ): Promise<ValidateGoogleResponse> {
    try {
      let user = await this.userRepo.getUserByGoogleID(request.user.id);
      if (!user) {
        const userId = uuidv4();
        const createUser: Prisma.UserCreateInput = {
          id: userId,
          firstName: request.user.firstName,
          lastName: request.user.lastName,
          email: request.user.email,
          photoURL: request.user.photoURL,
          role: $Enums.Role.USER,
          googleID: request.user.id,
        };
        user = await this.userRepo.create(createUser);
      } else {
        if (!user.googleID) {
          throw new RpcException({
            code: status.PERMISSION_DENIED,
            message: 'This email is already taken',
          });
        }
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
      const existUser = this.userRepo.getUserByEmail(request.email);
      if (existUser) {
        throw new GrpcInternalException({
          statusCode: 400,
          message: 'Email Duplicate',
        });
      } else {
        const hashedPassword = await bcrypt.hash(request.password, 12);
        const userId = uuidv4();
        const newUser: Prisma.UserCreateInput = {
          id: userId,
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phoneNumber: request.phoneNumber,
          role: request.role as $Enums.Role,
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
