import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateWalletRequest {
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
  coin: number
}
