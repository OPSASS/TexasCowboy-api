import { Prop } from "@nestjs/mongoose"

import mongoose from "mongoose"

export class Attachment {
    @Prop({
        type: mongoose.Schema.Types.String,
    })
    url: string

    @Prop({
        type: mongoose.Schema.Types.String,
    })
    type: string
}

export class ContentWithAttachment {
    @Prop({
        type: mongoose.Schema.Types.String,
    })
    content: string

    @Prop({
        type: Attachment,
    })
    attachment?: Attachment
}