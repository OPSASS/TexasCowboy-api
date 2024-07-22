import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { DetailedHistory } from '../schemas/detailedHistory.schema'
import { GameHistory } from '../schemas/gameHistory.schema'

export class CreateHistoryRequest {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsOptional()
  userId?: string

  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsOptional()
  gameId?: string

  @ApiProperty({
    type: Number,
    required: true,
    description: '苗字',
    example: '山田'
  })
  @IsNumber()
  @IsOptional()
  totalCoin?: number

  @IsArray()
  @IsOptional()
  detailedHistory?: DetailedHistory[]

  @IsObject()
  @IsOptional()
  gameHistory?: GameHistory

  @IsString()
  @IsOptional()
  gameModal?: string
}
