import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { Poker } from '../schemas'

@Injectable()
export class PokerRepository extends AbstractRepository<Poker> {
  protected readonly logger = new Logger(PokerRepository.name)

  constructor(@InjectModel(Poker.name) model, @InjectConnection() connection: Connection) {
    super(model, connection)
  }
}
