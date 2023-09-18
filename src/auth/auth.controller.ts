import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
<<<<<<< HEAD
import { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse } from './auth.pb';
=======
import { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse } from '../proto/auth';
>>>>>>> 9285fb7af8f0da5d50975fa38259494f79b5866a
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @GrpcMethod('AuthService', 'Login')
  login(request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(request: LogoutRequest): Promise<LogoutResponse> {
<<<<<<< HEAD
    return this.authService.logout(request);
=======
    return this.authService.Logout(request);
>>>>>>> 9285fb7af8f0da5d50975fa38259494f79b5866a
  }


}
