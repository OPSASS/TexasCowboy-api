import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator'
import { DetailedHistory } from '../schemas/detailedHistory.schema'

export class CreateHistoryRequest {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsDefined()
  userId: string

  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsDefined()
  gameId: string

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
