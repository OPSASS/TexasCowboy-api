import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'
import { CreateUserRequest } from 'src/users/dto/create.request'
import { User } from 'src/users/schemas'
import { UsersService } from 'src/users/services'
import { AuthDto } from '../dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Register User
   *
   * @param request
   * @returns
   */
  async signUp(request: CreateUserRequest) {
    const user = await this.usersService.create(request)
    const tokens = await this.getTokens(user._id.toString())
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken)

    return user
  }

  /**
   * Login function
   *
   * @param request
   * @returns
   */
  async signIn(request: AuthDto) {
    // Check if user exists
    const user = await this.usersService.validateUser(request.email, request.password)
    const tokens = await this.getTokens(user._id.toString())
    return await this.updateRefreshToken(user._id.toString(), tokens.refreshToken)

    // return user
  }

  /**
   * Logout function
   *
   * @param userId
   */
  async logout(userId: Partial<User>) {
    this.usersService.update(userId, { refreshToken: null })
  }

  /**
   * Get refresh token
   *
   * @param userId
   * @param refreshToken
   * @returns
   */
  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      })

      const user = await this.usersService.get(verify.id)
      if (user.refreshToken !== refreshToken) throw new ForbiddenException('Access Denied')
      const tokens = await this.getTokens(user._id.toString())
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken)
      return tokens
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }

  /**
   * Update user's refresh token
   *
   * @param userId
   * @param refreshToken
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.usersService.update(new Types.ObjectId(userId), {
      refreshToken
    })
  }

  async verifyToken(token: string): Promise<User> {
    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET')
    })

    return this.usersService.get({ _id: payload.userId })
  }

  /**
   * Renew token
   *
   * @param userId
   * @returns
   */
  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign({ id: userId }),
      this.jwtService.sign(
        { id: userId },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          privateKey: this.configService.get('JWT_REFRESH_SECRET_EXPIRATION')
        }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }
}
