import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator'
import { DetailedHistory } from '../schemas/detailedHistory.schema'

export class UpdateHistoryRequest {
  @ApiProperty({
    type: String,
    required: true,
    description: '苗字',
    example: '山田'
  })
  @IsString()
  @IsOptional()
  userId: string

  @ApiProperty({
    type: Number,
    required: true,
    description: '苗字',
    example: '山田'
  })
  @IsNumber()
  @IsDefined()
  totalCoin: number

  @IsArray()
  @IsOptional()
  detailedHistory?: DetailedHistory[]
}
