import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = 'user';

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

export interface UserService {
  register(request: RegisterRequest): Promise<RegisterResponse>;
}
