import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ _id: false, versionKey: false, timestamps: false })
class PlayersHistory {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  playerIndex: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  result: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  rankString: string
}

@Schema({ _id: false, versionKey: false, timestamps: false })
export class GameHistory {
  @Prop({
    type: [PlayersHistory]
  })
  playerHistory: PlayersHistory[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  highCardOrOnePair: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  twoPair: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  threeOfAKindOrStraightOrFlush: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  fullHouse: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  fourOfAKindOrStraightFlushOrRoyalFlush: boolean[]

  isAA: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  isHasPair: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  isFlush: boolean[]
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory)
