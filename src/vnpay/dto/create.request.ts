import { ModalEnum } from '@app/common'
import { IsDefined, IsNumber, IsString } from 'class-validator'

export class CreateVNPayRequest {
  @IsDefined()
  @IsNumber()
  coin: number

  @IsDefined()
  @IsString()
  targetModel: ModalEnum

  @IsDefined()
  @IsString()
  userId: string
}
