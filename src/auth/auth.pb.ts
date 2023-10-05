/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface Credential {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface GoogleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  credential: Credential | undefined;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  credential: Credential | undefined;
}

export interface LogoutRequest {
  credential: Credential | undefined;
}

export interface LogoutResponse {
  isDone: boolean;
}

export interface ValidateGoogleRequest {
  user: GoogleUser | undefined;
}

export interface ValidateGoogleResponse {
  credential: Credential | undefined;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  forgotPasswordUrl: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  login(request: LoginRequest): Observable<LoginResponse>;

  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse>;

  register(request: RegisterRequest): Observable<RegisterResponse>;

  logout(request: LogoutRequest): Observable<LogoutResponse>;

  validateGoogle(request: ValidateGoogleRequest): Observable<ValidateGoogleResponse>;

  forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse>;
}

export interface AuthServiceController {
  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> | Observable<RefreshTokenResponse> | RefreshTokenResponse;

  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  logout(request: LogoutRequest): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;

  validateGoogle(
    request: ValidateGoogleRequest,
  ): Promise<ValidateGoogleResponse> | Observable<ValidateGoogleResponse> | ValidateGoogleResponse;

  forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> | Observable<ForgotPasswordResponse> | ForgotPasswordResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "refreshToken", "register", "logout", "validateGoogle", "forgotPassword"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
