/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface GetUserSportAreaRequest {
  sportAreaId: string;
}

export interface GetUserSportAreaResponse {
  userId: string;
  sportAreaId: string;
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string;
  role: string;
  sportAreaId: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUserSportArea(request: GetUserSportAreaRequest): Observable<GetUserSportAreaResponse>;

  getUserProfile(request: GetUserProfileRequest): Observable<GetUserProfileResponse>;
}

export interface UserServiceController {
  getUserSportArea(
    request: GetUserSportAreaRequest,
  ): Promise<GetUserSportAreaResponse> | Observable<GetUserSportAreaResponse> | GetUserSportAreaResponse;

  getUserProfile(
    request: GetUserProfileRequest,
  ): Promise<GetUserProfileResponse> | Observable<GetUserProfileResponse> | GetUserProfileResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUserSportArea", "getUserProfile"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
