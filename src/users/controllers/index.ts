import { NotFoundInterceptor } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateUserRequest } from '../dto/create.request';
import { FindAllUserRequest } from '../dto/find.request';
import { UsersService } from '../services';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

 @Post('/')
  @UseInterceptors(NotFoundInterceptor)
  async createUser( 
     @Body() request: CreateUserRequest,
      ) {
     return this.userService.create(request)
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.get({ _id: new Types.ObjectId(id) });
  }

  @Post('/find')
  @UseInterceptors(NotFoundInterceptor)
  async listUser(@Body() request: FindAllUserRequest) {
    return this.userService.getList(
      request.filterQuery ? request.filterQuery : {},
      request.options,
    );
  }
}
