import { IsOptional, IsString } from 'class-validator'

class FilterQuery {
  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  targetModel?: string
}

export class FindAllRankingRequest {
  @IsOptional()
  filterQuery: FilterQuery

  @IsOptional()
  options: any
}
