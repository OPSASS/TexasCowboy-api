import { StatusEnum, TransactionTypeEnum } from '@app/common'
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
  transactionNo: string

  @IsOptional()
  @IsString()
  status: StatusEnum

  @IsOptional()
  @IsString()
  type: TransactionTypeEnum
}

export class FindAllTransactionRequest {
  @IsOptional()
  filterQuery: FilterQuery

  @IsOptional()
  options: PaginateOptions
}
