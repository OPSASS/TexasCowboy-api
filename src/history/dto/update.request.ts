import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDefined, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { DetailedHistory } from '../schemas/detailedHistory.schema'
import { GameHistory } from '../schemas/gameHistory.schema'

export class UpdateHistoryRequest {
  @ApiProperty({
    type: String,
    required: true,
    description: '苗字',
    example: '山田'
  })
  @IsString()
  @IsOptional()
  userId?: string

  @ApiProperty({
    type: Number,
    required: true,
    description: '苗字',
    example: '山田'
  })
  @IsNumber()
  @IsDefined()
  totalCoin?: number

  @IsArray()
  @IsOptional()
  detailedHistory?: DetailedHistory[]

  @IsString()
  @IsOptional()
  targetModel?: string

  @IsString()
  @IsOptional()
  gameId?: string

  @IsObject()
  @IsOptional()
  gameHistory?: GameHistory
}
