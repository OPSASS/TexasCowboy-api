import { GenderEnum, Message, RoleEnum } from '@app/common'
import { RegExpValidate } from '@app/common/constants/const'
import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEmail, IsNumber, IsOptional, IsString, Matches, MinLength, ValidateIf } from 'class-validator'
import { Match } from '../decorations/match.decoration'

export class CreateUserRequest {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsDefined()
  fullName: string

  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsDefined()
  lastName: string

  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsDefined()
  firstName: string

  @ApiProperty({
    type: String,
    default: GenderEnum.MALE,
    enum: GenderEnum,
    required: true
  })
  @IsString()
  @IsDefined()
  @Matches(`^${Object.values(GenderEnum).join('|')}$`, 'i')
  gender: GenderEnum

  @ApiProperty({
    type: String,
    example: '0901234567'
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'example_email@gmail.com'
  })
  @IsEmail({}, { message: Message.INVALID_EMAIL })
  @IsDefined()
  email: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'Zxcv1234!'
  })
  @IsDefined()
  @MinLength(6)
  @Matches(RegExpValidate.PASSWORD, { message: Message.PASSWORD_ERROR })
  password: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'Zxcv1234!'
  })
  @Match('password', { message: Message.PASSWORD_NOT_MATCH })
  confirmPassword: string

  @ApiProperty({
    type: String,
    required: false,
    example: new Date(),
    format: 'date',
    default: new Date()
  })
  @IsOptional()
  @IsString()
  birthday: Date

  @ApiProperty({
    type: Number,
    required: false,
    default: RoleEnum.USER,
    enum: RoleEnum,
    example: RoleEnum.USER
  })
  @IsNumber()
  @IsOptional()
  role?: RoleEnum

  @ApiProperty({
    type: Boolean,
    required: false,
    example: 'https://sohanews.sohacdn.com/2016/photo-6-1477717938461.jpg'
  })
  @ValidateIf((ob) => ob.isMentor)
  @IsOptional()
  @IsString()
  avatarUrl?: string
}
