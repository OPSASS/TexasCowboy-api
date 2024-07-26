import { VNPayResponseCodeEnum } from '@app/common'
import { IsOptional, IsString } from 'class-validator'

export class UpdateVNPayRequest {
  @IsOptional()
  @IsString()
  vnp_Amount: string

  @IsOptional()
  @IsString()
  vnp_BankCode: number

  @IsOptional()
  @IsString()
  vnp_BankTranNo: string

  @IsOptional()
  @IsString()
  vnp_CardType: string

  @IsOptional()
  @IsString()
  vnp_OrderInfo: string

  @IsOptional()
  @IsString()
  vnp_PayDate: string

  @IsOptional()
  @IsString()
  vnp_ResponseCode: VNPayResponseCodeEnum

  @IsOptional()
  @IsString()
  codeVNPay: string

  @IsOptional()
  @IsString()
  vnp_TmnCode: string

  @IsOptional()
  @IsString()
  vnp_TransactionNo: string

  @IsOptional()
  @IsString()
  vnp_SecureHash: string

  @IsOptional()
  @IsString()
  vnp_TxnRef: string

  @IsOptional()
  @IsString()
  vnp_TransactionStatus: string

  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsString()
  coin?: number
}
