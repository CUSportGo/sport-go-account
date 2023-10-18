import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  AuthServiceController,
  Credential,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  // ValidateGoogleRequest,
  // ValidateGoogleResponse,
  ValidateOAuthRequest,
} from './auth.pb';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { $Enums, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';
import { BlacklistRepository } from '../repository/blacklist.repository';
import { JwtPayload } from './strategies/accessToken.strategy';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService implements AuthServiceController {
  constructor(
    private userRepo: UserRepository,
    private blacklistRepo: BlacklistRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      let user = await this.userRepo.getUserByEmail(request.email);
      if (!user || user.googleID) {
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

      const { accessToken, refreshToken } = await this.getTokens(
        user.id,
        user.role,
      );
      user = await this.userRepo.update(user.id, {
        refreshToken: refreshToken,
      });
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
    try {
      const decodedToken = this.jwtService.verify(request.refreshToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      if (decodedToken.registeredClaims.expiredAt < Date.now()) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'token expired',
        });
      }

      const user = await this.userRepo.findUserById(decodedToken.sub);
      if (!user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'user not found',
        });
      }
      if (user.refreshToken != request.refreshToken) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'invalid token',
        });
      }

      const newAccessToken = await this.jwtService.signAsync(
        {
          sub: decodedToken.sub,
          registeredClaims: {
            issuer: this.configService.get<string>('TOKEN_ISSUER'),
            expiredAt: Date.now() + 60 * 15 * 1000,
            issuedAt: Date.now(),
          },
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      return { newAccessToken, accessTokenExpiresIn: 600 };
    } catch (err) {
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

  public async validateOAuth(
    request: ValidateOAuthRequest,
  ): Promise<LoginResponse> {
    try {
      let user = await this.userRepo.getUserByEmail(request.user.email);
      if (!user) {
        const userId = uuidv4();
        const createUser: Prisma.UserCreateInput = {
          id: userId,
          firstName: request.user.firstName,
          lastName: request.user.lastName,
          email: request.user.email,
          photoURL: request.user.photoURL,
          role: $Enums.Role.USER,
        };
        if (request.type == 'google') {
          createUser.googleID = request.user.id;
        } else {
          createUser.facebookID = request.user.id;
        }
        user = await this.userRepo.create(createUser);
      } else {
        if (!user.googleID && !user.facebookID) {
          throw new RpcException({
            code: status.PERMISSION_DENIED,
            message: 'This email is already taken',
          });
        }

        if (
          request.type == 'google' &&
          (user.googleID != request.user.id || user.facebookID)
        ) {
          throw new RpcException({
            code: status.PERMISSION_DENIED,
            message: 'This email is already taken',
          });
        }

        if (
          request.type == 'facebook' &&
          (user.facebookID != request.user.id || user.googleID)
        ) {
          throw new RpcException({
            code: status.PERMISSION_DENIED,
            message: 'This email is already taken',
          });
        }
      }

      const { accessToken, refreshToken } = await this.getTokens(
        user.id,
        user.role,
      );
      user = await this.userRepo.update(user.id, {
        refreshToken: refreshToken,
      });
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

  public async validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    try {
      const decodedToken = this.jwtService.verify(request.token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      if (!decodedToken) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'invalid token',
        });
      }
      if (
        decodedToken.registeredClaims.issuer !==
        this.configService.get<string>('TOKEN_ISSUER')
      ) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'invalid token',
        });
      }

      if (decodedToken.registeredClaims.expiredAt < Date.now()) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'invalid token',
        });
      }

      return { userId: decodedToken.sub, role: decodedToken.role };
    } catch (err) {
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

  private async getTokens(userId: string, role: string) {
    try {
      const accessToken = await this.jwtService.signAsync(
        {
          sub: userId,
          role: role,
          registeredClaims: {
            issuer: this.configService.get<string>('TOKEN_ISSUER'),
            expiredAt: Date.now() + 60 * 15 * 1000,
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
            expiredAt: Date.now() + 60 * 60 * 24 * 7 * 1000,
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

  async resetPassword(
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    try {
      const credential = this.jwtService.decode(
        request.accessToken,
      ) as JwtPayload;
      const user = await this.userRepo.findUserById(credential.sub);

      const isPasswordMatch = await bcrypt.compare(
        request.password,
        user.password,
      );
      if (isPasswordMatch) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'New password should not be the same as the old one.',
        });
      }

      const hashedPassword = await bcrypt.hash(request.password, 12);
      await this.userRepo.update(user.id, {
        password: hashedPassword,
      });

      return { isDone: true };
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
  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    try {
      await this.blacklistRepo.addOutdatedToken({
        outDatedAccessToken: request.credential.accessToken,
      });

      let credential = this.jwtService.decode(
        request.credential.refreshToken,
      ) as JwtPayload;
      let userId = credential.sub;

      await this.userRepo.update(userId, {
        refreshToken: null,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(
          'There is a unique constraint violation, a blacklist should not outdated twice!',
        );
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }

    const response: LogoutResponse = { isDone: true };
    return response;
  }

  async forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    try {
      const user = await this.userRepo.getUserByEmail(request.email);
      if (!user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'user not found',
        });
      }
      // gen token
      const userToken = (await this.getTokens(user.id, user.role)).accessToken;
      const linkToResetPassword =
        'http://localhost:3000/reset-password/' + userToken;

      //set connection
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Set to true if using SSL
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Define email options
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: request.email,
        subject: 'Password Reset',
        html: `
          <p>You have requested a password reset. Click the link below to reset your password:</p>
          <a href="${linkToResetPassword}">Reset Password</a>
        `,
      };
      await transporter.sendMail(mailOptions);
      return { resetPasswordUrl: linkToResetPassword };
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
}
