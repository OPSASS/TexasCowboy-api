import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { History } from '../schemas'

@Injectable()
export class HistoryRepository extends AbstractRepository<History> {
  protected readonly logger = new Logger(HistoryRepository.name)

  constructor(@InjectModel(History.name) model, @InjectConnection() connection: Connection) {
    super(model, connection)
  }
}
