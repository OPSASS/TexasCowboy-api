import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateRankingRequest {
  @IsString()
  @IsOptional()
  userId?: string

  @IsNumber()
  @IsOptional()
  totalCoin?: number

  @IsNumber()
  @IsOptional()
  oldCoin?: number

  @IsString()
  @IsOptional()
  targetModel?: string
}
