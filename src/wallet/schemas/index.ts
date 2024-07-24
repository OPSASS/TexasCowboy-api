import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Wallet extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.String,
    unique: true
  })
  userId: string

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  coin?: number
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)
WalletSchema.plugin(paginate)
WalletSchema.index({ userId: 'text' })
