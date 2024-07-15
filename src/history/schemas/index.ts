import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { DetailedHistory } from './detailedHistory.schema'

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class History extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  userId: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  gameId: string

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  totalCoin: number

  @Prop({
    type: [DetailedHistory],
    default: []
  })
  detailedHistory?: DetailedHistory[]
}

export const HistorySchema = SchemaFactory.createForClass(History)
HistorySchema.index({ userId: 'text', history: 'text' })
