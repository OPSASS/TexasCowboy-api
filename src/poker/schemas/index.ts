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
export class Poker extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.Array,
    default: 1,
    min: 1,
    max: 52
  })
  dealer?: number[]

  @Prop({
    type: mongoose.Schema.Types.Array,
    min: 1,
    max: 52
  })
  player1?: number[]

  @Prop({
    type: mongoose.Schema.Types.Array,
    min: 1,
    max: 52
  })
  player2?: number[]

  @Prop({
    type: mongoose.Schema.Types.Array,
    min: 1,
    max: 52
  })
  pack?: number[]

  @Prop({
    type: mongoose.Schema.Types.String
  })
  historyId?: string
}

export const PokerSchema = SchemaFactory.createForClass(Poker)
PokerSchema.plugin(paginate)
