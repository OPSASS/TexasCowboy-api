import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { ModalEnum } from '../../../libs/common/src/constants/enum'
import { DetailedHistory } from './detailedHistory.schema'
import { GameHistory } from './gameHistory.schema'

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
  userId?: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ModalEnum.TEXAS_COWBOY,
    enum: ModalEnum
  })
  gameModal?: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  gameId?: string

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  totalCoin?: number

  @Prop({
    type: [DetailedHistory],
    default: undefined
  })
  detailedHistory?: DetailedHistory[]

  @Prop()
  gameHistory?: GameHistory
}

export const HistorySchema = SchemaFactory.createForClass(History)
HistorySchema.index({ userId: 'text', history: 'text' })
