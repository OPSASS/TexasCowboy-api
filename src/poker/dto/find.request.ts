import { IsOptional } from 'class-validator'

class FilterQuery {}

export class FindAllPokerRequest {
  @IsOptional()
  filterQuery: FilterQuery

  @IsOptional()
  options: any
}
