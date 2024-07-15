import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDefined } from 'class-validator'

export class CreatePokerRequest {
  @ApiProperty({
    type: Array,
    required: true
  })
  @IsArray()
  @IsDefined()
  dealer: number[]
}
