import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator'

export class CreatePokerRequest {
  @ApiProperty({
    type: Array,
    required: true
  })
  @IsArray()
  @IsDefined()
  dealer: number[]

  @ApiProperty({
    type: Array
  })
  @IsArray()
  @IsOptional()
  pack?: number[]

  @ApiProperty({
    type: String
  })
  @IsString()
  @IsOptional()
  historyId?: string
}
