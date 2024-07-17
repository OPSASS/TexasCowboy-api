import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDefined, IsOptional } from 'class-validator'

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
}
