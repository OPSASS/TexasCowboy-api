import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { GameHistory } from './gameHistory.schema'
import { Result } from './result.schema'

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

  @Prop()
  result?: Result

  @Prop()
  gameHistory?: GameHistory

  @Prop({
    type: mongoose.Schema.Types.Array,
    min: 1,
    max: 52
  })
  pack?: number[]
}

export const PokerSchema = SchemaFactory.createForClass(Poker)
