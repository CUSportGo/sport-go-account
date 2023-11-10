import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/model/user.dto';
import { GetUserProfileRequest, GetUserProfileResponse, GetUserSportAreaRequest, GetUserSportAreaResponse } from './user.pb';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Patch('ban/:userId')
  banUser(@Param('userId') userId: string): Promise<User> {
    return this.userService.banUser(userId);
  }

  @Patch('unban/:userId')
  unbanUser(@Param('userId') userId: string): Promise<User> {
    return this.userService.unbanUser(userId);
  }

  @GrpcMethod('UserService', 'GetUserSportArea')
  getUserSportArea(
    request: GetUserSportAreaRequest,
  ): Promise<GetUserSportAreaResponse> {
    return this.userService.getUserSportArea(request);
  }

  @GrpcMethod('UserService', 'GetUserProfile')
  getUserProfile(
    request: GetUserProfileRequest,
  ): Promise<GetUserProfileResponse> {
    return this.userService.getUserProfile(request);
  }


}
