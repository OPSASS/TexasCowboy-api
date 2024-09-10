import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateRankingRequest {
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
