import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional } from 'class-validator'

export class UpdatePokerRequest {
  @ApiProperty({
    type: Array,
    required: true
  })
  @IsArray()
  @IsOptional()
  dealer?: number[]

  @ApiProperty({
    type: Array,
    required: true
  })
  @IsArray()
  @IsOptional()
  player1?: number[]

  @ApiProperty({
    type: Array,
    required: true
  })
  @IsArray()
  @IsOptional()
  player2?: number[]

  @ApiProperty({
    type: Array
  })
  @IsArray()
  @IsOptional()
  pack?: number[]
}
