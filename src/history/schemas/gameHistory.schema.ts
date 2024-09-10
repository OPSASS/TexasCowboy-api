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
  playerHistory?: PlayersHistory[]

  @Prop({
    type: [PlayersHistory]
  })
  result?: PlayersHistory[]

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  jackpot?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  oldJackpot?: number

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  highCardOrOnePair?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  twoPair?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  threeOfAKindOrStraightOrFlush?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  fullHouse?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  fourOfAKindOrStraightFlushOrRoyalFlush?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  isAA?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  isHasPair?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  isFlush?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  red?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  draw?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Array
  })
  blue?: boolean[]

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countRed?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countDraw?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countBlue?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countHighCardOrOnePair?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countTwoPair?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countThreeOfAKindOrStraightOrFlush?: number
  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countFullHouse?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countFourOfAKindOrStraightFlushOrRoyalFlush?: number
  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countIsAA?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countIsHasPair?: number

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  countIsFlush?: number
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory)
