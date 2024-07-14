import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateWalletRequest {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsDefined()
  userId: string

  @ApiProperty({
    type: Number,
    required: true,
    description: '苗字',
    example: '山田'
  })
  @IsNumber()
  @IsOptional()
  coin?: number
}
