import { Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Patch('ban/:userId')
  banUser() {
    return null;
  }

  @Patch('unban/:userId')
  unbanUser() {
    return null;
  }
}
