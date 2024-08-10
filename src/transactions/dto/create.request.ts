import { ModalEnum, TransactionTypeEnum } from '@app/common'
import { IsDefined, IsNumber, IsString } from 'class-validator'

export class CreateTransactionRequest {
  @IsDefined()
  @IsNumber()
  coin: number

  @IsDefined()
  @IsString()
  targetModel: ModalEnum

  @IsDefined()
  @IsString()
  type: TransactionTypeEnum

  @IsDefined()
  @IsString()
  userId: string

  @IsDefined()
  @IsString()
  transactionNo?: string

  @IsDefined()
  @IsString()
  codeTransaction: string
}
