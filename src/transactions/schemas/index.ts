import { AbstractDocument, ModalEnum, toJSON, TransactionEnum, TransactionTypeEnum } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

@Schema({ versionKey: false, timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Transaction extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  userId: string

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  coin: number

  @Prop({
    type: mongoose.Schema.Types.String
  })
  transactionNo?: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  codeTransaction: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: TransactionEnum.PENDING,
    enum: TransactionEnum
  })
  status?: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  ipAddress: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  responseCode?: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  targetModel?: ModalEnum

  @Prop({
    type: mongoose.Schema.Types.String
  })
  type?: TransactionTypeEnum
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
TransactionSchema.plugin(paginate)
TransactionSchema.plugin(toJSON)
