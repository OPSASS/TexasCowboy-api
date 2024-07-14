import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
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

  @Get('signin')
  sigIn(@Body() data: AuthDto) {
    return this.authService.signIn(data)
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.body._id)
  }

  @Get('refresh-token')
  refreshToken(@Query('token') token: string) {
    return this.authService.refreshToken(token)
  }
}
