import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/model/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAllUsers() {
    return null;
  }

  @Patch('ban/:userId')
  banUser(@Param('userId') userId: string) : Promise<User>{
    return this.userService.banUser(userId);
  }

  @Patch('unban/:userId')
  unbanUser() {
    return null;
  }
}
