/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "auth";

export interface Credential {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
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
  credential: Credential | undefined;
}

function createBaseCredential(): Credential {
  return { accessToken: "", refreshToken: "", accessTokenExpiresIn: 0, refreshTokenExpiresIn: 0 };
}

export const Credential = {
  encode(message: Credential, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessToken !== "") {
      writer.uint32(10).string(message.accessToken);
    }
    if (message.refreshToken !== "") {
      writer.uint32(18).string(message.refreshToken);
    }
    if (message.accessTokenExpiresIn !== 0) {
      writer.uint32(24).int32(message.accessTokenExpiresIn);
    }
    if (message.refreshTokenExpiresIn !== 0) {
      writer.uint32(32).int32(message.refreshTokenExpiresIn);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Credential {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCredential();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accessToken = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.accessTokenExpiresIn = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.refreshTokenExpiresIn = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Credential {
    return {
      accessToken: isSet(object.accessToken) ? String(object.accessToken) : "",
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "",
      accessTokenExpiresIn: isSet(object.accessTokenExpiresIn) ? Number(object.accessTokenExpiresIn) : 0,
      refreshTokenExpiresIn: isSet(object.refreshTokenExpiresIn) ? Number(object.refreshTokenExpiresIn) : 0,
    };
  },

  toJSON(message: Credential): unknown {
    const obj: any = {};
    if (message.accessToken !== "") {
      obj.accessToken = message.accessToken;
    }
    if (message.refreshToken !== "") {
      obj.refreshToken = message.refreshToken;
    }
    if (message.accessTokenExpiresIn !== 0) {
      obj.accessTokenExpiresIn = Math.round(message.accessTokenExpiresIn);
    }
    if (message.refreshTokenExpiresIn !== 0) {
      obj.refreshTokenExpiresIn = Math.round(message.refreshTokenExpiresIn);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Credential>, I>>(base?: I): Credential {
    return Credential.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Credential>, I>>(object: I): Credential {
    const message = createBaseCredential();
    message.accessToken = object.accessToken ?? "";
    message.refreshToken = object.refreshToken ?? "";
    message.accessTokenExpiresIn = object.accessTokenExpiresIn ?? 0;
    message.refreshTokenExpiresIn = object.refreshTokenExpiresIn ?? 0;
    return message;
  },
};

function createBaseLoginRequest(): LoginRequest {
  return { email: "", password: "" };
}

export const LoginRequest = {
  encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      email: isSet(object.email) ? String(object.email) : "",
      password: isSet(object.password) ? String(object.password) : "",
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginRequest>, I>>(base?: I): LoginRequest {
    return LoginRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest();
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseLoginResponse(): LoginResponse {
  return { credential: undefined };
}

export const LoginResponse = {
  encode(message: LoginResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credential !== undefined) {
      Credential.encode(message.credential, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credential = Credential.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginResponse {
    return { credential: isSet(object.credential) ? Credential.fromJSON(object.credential) : undefined };
  },

  toJSON(message: LoginResponse): unknown {
    const obj: any = {};
    if (message.credential !== undefined) {
      obj.credential = Credential.toJSON(message.credential);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginResponse>, I>>(base?: I): LoginResponse {
    return LoginResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginResponse>, I>>(object: I): LoginResponse {
    const message = createBaseLoginResponse();
    message.credential = (object.credential !== undefined && object.credential !== null)
      ? Credential.fromPartial(object.credential)
      : undefined;
    return message;
  },
};

function createBaseRefreshTokenRequest(): RefreshTokenRequest {
  return { refreshToken: "" };
}

export const RefreshTokenRequest = {
  encode(message: RefreshTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.refreshToken !== "") {
      writer.uint32(10).string(message.refreshToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshTokenRequest {
    return { refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "" };
  },

  toJSON(message: RefreshTokenRequest): unknown {
    const obj: any = {};
    if (message.refreshToken !== "") {
      obj.refreshToken = message.refreshToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshTokenRequest>, I>>(base?: I): RefreshTokenRequest {
    return RefreshTokenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefreshTokenRequest>, I>>(object: I): RefreshTokenRequest {
    const message = createBaseRefreshTokenRequest();
    message.refreshToken = object.refreshToken ?? "";
    return message;
  },
};

function createBaseRefreshTokenResponse(): RefreshTokenResponse {
  return { credential: undefined };
}

export const RefreshTokenResponse = {
  encode(message: RefreshTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credential !== undefined) {
      Credential.encode(message.credential, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshTokenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credential = Credential.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshTokenResponse {
    return { credential: isSet(object.credential) ? Credential.fromJSON(object.credential) : undefined };
  },

  toJSON(message: RefreshTokenResponse): unknown {
    const obj: any = {};
    if (message.credential !== undefined) {
      obj.credential = Credential.toJSON(message.credential);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshTokenResponse>, I>>(base?: I): RefreshTokenResponse {
    return RefreshTokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RefreshTokenResponse>, I>>(object: I): RefreshTokenResponse {
    const message = createBaseRefreshTokenResponse();
    message.credential = (object.credential !== undefined && object.credential !== null)
      ? Credential.fromPartial(object.credential)
      : undefined;
    return message;
  },
};

function createBaseLogoutRequest(): LogoutRequest {
  return { credential: undefined };
}

export const LogoutRequest = {
  encode(message: LogoutRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credential !== undefined) {
      Credential.encode(message.credential, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogoutRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogoutRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credential = Credential.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LogoutRequest {
    return { credential: isSet(object.credential) ? Credential.fromJSON(object.credential) : undefined };
  },

  toJSON(message: LogoutRequest): unknown {
    const obj: any = {};
    if (message.credential !== undefined) {
      obj.credential = Credential.toJSON(message.credential);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LogoutRequest>, I>>(base?: I): LogoutRequest {
    return LogoutRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LogoutRequest>, I>>(object: I): LogoutRequest {
    const message = createBaseLogoutRequest();
    message.credential = (object.credential !== undefined && object.credential !== null)
      ? Credential.fromPartial(object.credential)
      : undefined;
    return message;
  },
};

function createBaseLogoutResponse(): LogoutResponse {
  return { credential: undefined };
}

export const LogoutResponse = {
  encode(message: LogoutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.credential !== undefined) {
      Credential.encode(message.credential, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogoutResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogoutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.credential = Credential.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LogoutResponse {
    return { credential: isSet(object.credential) ? Credential.fromJSON(object.credential) : undefined };
  },

  toJSON(message: LogoutResponse): unknown {
    const obj: any = {};
    if (message.credential !== undefined) {
      obj.credential = Credential.toJSON(message.credential);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LogoutResponse>, I>>(base?: I): LogoutResponse {
    return LogoutResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LogoutResponse>, I>>(object: I): LogoutResponse {
    const message = createBaseLogoutResponse();
    message.credential = (object.credential !== undefined && object.credential !== null)
      ? Credential.fromPartial(object.credential)
      : undefined;
    return message;
  },
};

export interface AuthService {
  Login(request: LoginRequest): Promise<LoginResponse>;
  RefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  Logout(request: LogoutRequest): Promise<LogoutResponse>;
}

export const AuthServiceServiceName = "auth.AuthService";
export class AuthServiceClientImpl implements AuthService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || AuthServiceServiceName;
    this.rpc = rpc;
    this.Login = this.Login.bind(this);
    this.RefreshToken = this.RefreshToken.bind(this);
    this.Logout = this.Logout.bind(this);
  }
  Login(request: LoginRequest): Promise<LoginResponse> {
    const data = LoginRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Login", data);
    return promise.then((data) => LoginResponse.decode(_m0.Reader.create(data)));
  }

  RefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const data = RefreshTokenRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RefreshToken", data);
    return promise.then((data) => RefreshTokenResponse.decode(_m0.Reader.create(data)));
  }

  Logout(request: LogoutRequest): Promise<LogoutResponse> {
    const data = LogoutRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Logout", data);
    return promise.then((data) => LogoutResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
