import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Types } from 'mongoose'
import { CreateUserRequest } from 'src/users/dto/create.request'
import { AuthDto } from '../dto/auth.dto'
import { AuthService } from '../services'

@Controller('/auth/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserRequest) {
    return this.authService.signUp(createUserDto)
  }

  @Post('signin')
  sigIn(@Body() data: AuthDto) {
    return this.authService.signIn(data)
  }

  @Get('logout')
  logout(@Query('id') id: string) {
    this.authService.logout(new Types.ObjectId(id))
  }

  @Get('refresh-token')
  refreshToken(@Query('token') token: string) {
    return this.authService.refreshToken(token)
  }
}
