import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  GrpcInternalException,
  GrpcUnauthenticatedException,
} from 'nestjs-grpc-exceptions';
import {
  AuthService as AuthGRPCService,
  Credential,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from '../proto/auth';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements AuthGRPCService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async Login(request: LoginRequest): Promise<LoginResponse> {
    try {
      let user = await this.userRepo.getUserByEmail(request.email);
      const isPasswordMatch = await bcrypt.compare(
        request.password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new GrpcUnauthenticatedException({
          statusCode: 401,
          message: 'email or password is incorrect',
        });
      }

      const { accessToken, refreshToken } = await this.getTokens(user.id);
      user = await this.userRepo.updateRefreshToken(user.id, refreshToken);
      if (!user) {
        throw new GrpcInternalException({
          statusCode: 500,
          message: 'internal error',
        });
      }

      const credential = Credential.create({
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpiresIn: 600,
        refreshTokenExpiresIn: 604800,
      });
      return LoginResponse.create({ credential });
    } catch (err: any) {
      console.log(err);
      return err;
    }
  }

  RefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return null;
  }

  async getTokens(userId: string) {
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
  }

  async Register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const existUser = this.userRepo.findUnique({
        email: request.email,
      });
      if (existUser) {
        throw new GrpcInternalException({
          statusCode: 400,
          message: 'Email Duplicate',
        });
      } else {
        const hashedPassword = await bcrypt.hash(request.password, 12);
        const newUser = {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phoneNumber: request.phoneNumber,
          role: request.role,
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
