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

export interface OAuthUser {
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

export interface ValidateOAuthRequest {
  user: OAuthUser | undefined;
  type: string;
}

export interface LogoutRequest {
  credential: Credential | undefined;
}


export interface ResetPasswordRequest {
  accessToken: string;
  password: string;
}

export interface ResetPasswordResponse {
}
export interface LogoutResponse {

  isDone: boolean;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  login(request: LoginRequest): Observable<LoginResponse>;

  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse>;

  register(request: RegisterRequest): Observable<RegisterResponse>;

  validateGoogle(request: ValidateGoogleRequest): Observable<ValidateGoogleResponse>;

  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResponse>;

  validateOAuth(request: ValidateOAuthRequest): Observable<LoginResponse>;

  logout(request: LogoutRequest): Observable<LogoutResponse>;

}

export interface AuthServiceController {
  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> | Observable<RefreshTokenResponse> | RefreshTokenResponse;

  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;


  validateGoogle(
    request: ValidateGoogleRequest,
  ): Promise<ValidateGoogleResponse> | Observable<ValidateGoogleResponse> | ValidateGoogleResponse;

  resetPassword(
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> | Observable<ResetPasswordResponse> | ResetPasswordResponse;

  validateOAuth(request: ValidateOAuthRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  logout(request: LogoutRequest): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;

}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {

    const grpcMethods: string[] = ["login", "refreshToken", "register", "validateGoogle", "resetPassword", "logout"];

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
