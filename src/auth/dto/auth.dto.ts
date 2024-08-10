import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString } from 'class-validator'

export class AuthDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User email address',
    example: 'example_email@gmail.com or 055546121'
  })
  @IsDefined()
  @IsString()
  account: string

  @ApiProperty({ type: String, required: true, description: 'User password', example: 'Zxcv1234!' })
  @IsDefined()
  @IsString()
  password: string
}
