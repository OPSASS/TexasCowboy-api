import { AbstractDocument, GenderEnum, RoleEnum, StatusEnum, VerifyStatusEnum } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class User extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  fullName: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  lastName: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  firstName: string

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: GenderEnum
  })
  gender: GenderEnum

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  avatarUrl?: string

  @Prop({
    type: mongoose.Schema.Types.String,
    unique: true,
    lowercase: true
  })
  email: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  password: string

  @Prop({
    type: mongoose.Schema.Types.Date
  })
  birthday: Date

  @Prop({
    type: mongoose.Schema.Types.String
  })
  phoneNumber?: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: StatusEnum.ACTIVE,
    enum: StatusEnum
  })
  accountStatus?: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: VerifyStatusEnum.UNVERIFIED,
    enum: VerifyStatusEnum
  })
  emailStatus?: string

  @Prop({
    type: mongoose.Schema.Types.String,
    default: VerifyStatusEnum.UNVERIFIED,
    enum: VerifyStatusEnum
  })
  phoneStatus?: string

  @Prop({
    type: mongoose.Schema.Types.Array,
    default: RoleEnum.USER,
    comments: 'ユーザーの権利 => 0: ユーザー, 1: メンター, 2: 管理者'
  })
  role?: number

  @Prop({
    type: mongoose.Schema.Types.String
  })
  refreshToken?: string

  @Prop({
    type: mongoose.Schema.Types.String
  })
  walletId?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(paginate)
UserSchema.index({ fullName: 'text', email: 'text', phoneNumber: 'text' })
UserSchema.virtual('wallet', {
  ref: 'Wallet',
  localField: 'walletId',
  foreignField: '_id',
  justOne: true,
  match: { _destroy: false }
})

UserSchema.pre('findOne', function () {
  this.populate([{ path: 'wallet', select: 'coin' }])
})
