import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { ModalEnum } from '../../../libs/common/src/constants/enum'

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Ranking extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  userId?: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ModalEnum.TEXAS_COWBOY,
    enum: ModalEnum
  })
  targetModel?: string

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  totalCoin?: number

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  oldCoin?: number
}

export const RankingSchema = SchemaFactory.createForClass(Ranking)
RankingSchema.plugin(paginate)
RankingSchema.index({ userId: 'text', history: 'text' })

RankingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  match: { _destroy: false }
})

RankingSchema.pre('find', function () {
  this.populate([{ path: 'user', select: 'fullName avatarUrl' }])
})
