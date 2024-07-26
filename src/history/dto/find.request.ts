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
  userId?: string

  @ApiProperty({
    type: String,
    required: true,
    description: 'ユーザーのフルネーム'
  })
  @IsString()
  @IsOptional()
  gameId?: string

  @IsString()
  @IsOptional()
  targetModel?: string
}

export class FindAllHistoryRequest {
  @IsOptional()
  filterQuery: FilterQuery

  @IsOptional()
  options: any
}
