import { IsOptional, IsString } from 'class-validator'

class FilterQuery {
  @IsString()
  @IsOptional()
  userId?: string

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
