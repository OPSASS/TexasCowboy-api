import { IsOptional, IsString } from 'class-validator'
import { PaginateOptions } from 'mongoose'

class FilterQuery {
  @IsOptional()
  @IsString()
  userId: string

  @IsOptional()
  @IsString()
  ipAddress: string

  @IsOptional()
  @IsString()
  bankCode: string

  @IsOptional()
  @IsString()
  codeVNPay: string
}

export class FindAllVNPayRequest {
  @IsOptional()
  filterQuery: FilterQuery

  @IsOptional()
  options: PaginateOptions
}
