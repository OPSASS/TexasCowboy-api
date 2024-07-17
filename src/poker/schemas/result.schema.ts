import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ _id: false, versionKey: false, timestamps: false })
class AnyPlayers {
  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isAA: boolean

  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isHasPair: boolean

  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isFlush: boolean

  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isStraight: boolean

  @Prop({
    type: mongoose.Schema.Types.Boolean
  })
  isStraightFlush: boolean
}

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Result {
  @Prop()
  anyPlayers: AnyPlayers

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  players: string[]
}

export const ResultSchema = SchemaFactory.createForClass(Result)
