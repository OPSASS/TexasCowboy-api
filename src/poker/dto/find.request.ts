import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

class FilterQuery {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsOptional()
  userId: string
}

export class FindAllPokerRequest {
  @IsOptional()
  filterQuery: FilterQuery

  @IsOptional()
  options: any
}
