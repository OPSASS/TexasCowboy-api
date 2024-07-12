import { GenderEnum, Message, RoleEnum } from '@app/common'
import { RegExpValidate } from '@app/common/constants/const'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { Match } from '../decorations/match.decoration'

export class UpdateUserRequest {
  @ApiProperty({
    type: String,
    required: false,
    description: 'ユーザーのフルネーム',
    example: '山田 太郎',
  })
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiProperty({
    type: String,
    required: false,
    description: '苗字',
    example: '山田',
  })
  @IsString()
  @IsOptional()
  lastName?: string

  @ApiProperty({
    type: String,
    required: false,
    description: 'ファーストネーム',
    example: '太郎',
  })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({
    type: String,
    default: GenderEnum.MALE,
    enum: GenderEnum,
    required: false,
    description: '性別',
    example: '男',
  })
  @IsString()
  @IsOptional()
  gender?: GenderEnum

  @ApiProperty({
    type: String,
    required: false,
    description: 'ユーザーの電話番号',
    example: '0901234567',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string

  @ApiProperty({
    type: String,
    required: false,
    description: 'ユーザーのメールアドレス',
    example: 'example_email@gmail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: Message.INVALID_EMAIL })
  email?: string

  @ApiProperty({
    type: String,
    required: false,
    description: 'ユーザーのパスワード',
    example: 'Zxcv1234!',
  })
  @IsOptional()
  @MinLength(6)
  @Matches(RegExpValidate.PASSWORD, { message: Message.PASSWORD_NOT_MATCH })
  password?: string

  @ApiProperty({
    type: String,
    required: false,
    description: 'ユーザーのパスワード確認',
    example: 'Zxcv1234!',
  })
  @Match('password', { message: Message.PASSWORD_NOT_MATCH })
  confirmPassword?: string

  @ApiProperty({
    type: String,
    required: false,
    description: 'ユーザーの生年月日',
    example: new Date(),
    format: 'date',
    default: new Date(),
  })
  @IsOptional()
  @IsString()
  birthday?: Date

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'アバターのURL',
    example: 'https://sohanews.sohacdn.com/2016/photo-6-1477717938461.jpg',
  })
  @IsOptional()
  avatarUrl?: string

  @ApiProperty({
    type: Number,
    required: false,
    enum: RoleEnum,
    description: 'ユーザーの権利 => 0: ユーザー, 1: メンター, 2: 管理者',
    example: 0,
  })
  @IsOptional()
  role?: RoleEnum

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptions?: string

  @IsOptional()
  @IsString()
  refreshToken?: string
}
