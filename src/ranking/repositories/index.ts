import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { Ranking } from '../schemas'

@Injectable()
export class RankingRepository extends AbstractRepository<Ranking> {
  protected readonly logger = new Logger(RankingRepository.name)

  constructor(@InjectModel(Ranking.name) model, @InjectConnection() connection: Connection) {
    super(model, connection)
  }
}
