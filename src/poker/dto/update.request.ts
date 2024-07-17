import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsObject, IsOptional } from 'class-validator'
import { GameHistory } from '../schemas/gameHistory.schema'
import { Result } from '../schemas/result.schema'

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
    type: Array,
    required: true
  })
  @IsObject()
  @IsOptional()
  result?: Result

  @IsObject()
  @IsOptional()
  gameHistory?: GameHistory

  @ApiProperty({
    type: Array
  })
  @IsArray()
  @IsOptional()
  pack?: number[]
}
