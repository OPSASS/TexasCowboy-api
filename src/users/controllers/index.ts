import { NotFoundInterceptor, RoleEnum } from '@app/common'
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Types } from 'mongoose'
import { CreateUserRequest } from '../dto/create.request'
import { FindAllUserRequest } from '../dto/find.request'
import { UpdateUserRequest } from '../dto/update.request'
import { UsersService } from '../services'

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('/')
  @UseInterceptors(NotFoundInterceptor)
  async createUser(@Body() request: CreateUserRequest) {
    return this.userService.create(request)
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  async updateUser(@Req() req: any, @Param('id') id: string, @Body() request: UpdateUserRequest) {
    if (req.user.role.includes(RoleEnum.ADMIN) || req.user._id.toString() === id) {
      return this.userService.update(new Types.ObjectId(id), request)
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.get(new Types.ObjectId(id))
  }

  @Post('/find')
  @UseInterceptors(NotFoundInterceptor)
  async listUser(@Body() request: FindAllUserRequest) {
    return this.userService.getList(request.filterQuery ? request.filterQuery : {}, request.options)
  }
}
