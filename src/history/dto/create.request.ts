import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { DetailedHistory } from '../schemas/detailedHistory.schema'
import { GameHistory } from '../schemas/gameHistory.schema'

export class CreateHistoryRequest {
  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  gameId?: string

  @IsNumber()
  @IsOptional()
  totalCoin?: number

  @IsNumber()
  @IsOptional()
  oldCoin?: number

  @IsArray()
  @IsOptional()
  detailedHistory?: DetailedHistory[]

  @IsObject()
  @IsOptional()
  gameHistory?: GameHistory

  @IsString()
  @IsOptional()
  targetModel?: string
}
