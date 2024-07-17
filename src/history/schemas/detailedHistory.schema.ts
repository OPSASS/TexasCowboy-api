import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ versionKey: false, timestamps: false })
export class DetailedHistory {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  name: string

  @Prop({
    type: mongoose.Schema.Types.Number
  })
  coin: number
}

export const DetailedHistorySchema = SchemaFactory.createForClass(DetailedHistory)
