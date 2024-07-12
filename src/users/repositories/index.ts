import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, } from 'mongoose'
import { User } from '../schemas'

@Injectable()
export class UserRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UserRepository.name)

    constructor(
        @InjectModel(User.name) model,
        @InjectConnection() connection: Connection
    ) {
        super(model, connection)
    }
}
