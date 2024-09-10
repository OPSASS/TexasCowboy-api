import { IsArray, IsDefined, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { DetailedHistory } from '../schemas/detailedHistory.schema'
import { GameHistory } from '../schemas/gameHistory.schema'

export class UpdateHistoryRequest {
  @IsString()
  @IsOptional()
  userId?: string

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
