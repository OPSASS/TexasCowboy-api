import { Message } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEmail, IsString } from 'class-validator'

export class AuthDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのメールアドレス',
    example: 'example_email@gmail.com'
  })
  @IsDefined()
  @IsEmail({}, { message: Message.INVALID_EMAIL })
  @IsString()
  email: string

  @ApiProperty({ type: String, required: true, description: 'ユーザーのパスワード', example: 'Zxcv1234!' })
  @IsDefined()
  @IsString()
  password: string
}
