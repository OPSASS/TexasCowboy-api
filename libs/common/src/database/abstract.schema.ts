import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose'

@Schema({ timestamps: true })
export class AbstractDocument {
    @Prop({ type: SchemaTypes.String })
    docName?: string

    @Prop({ type: SchemaTypes.Number })
    position?: number
    @Prop({ type: SchemaTypes.ObjectId })
    parentId?: string

    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId })
    createdById?: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId })
    updatedById?: Types.ObjectId

    @Prop({ type: SchemaTypes.Boolean, default: false })
    _destroy?: boolean
}
