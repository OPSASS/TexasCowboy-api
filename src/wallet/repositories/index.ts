import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { Wallet } from '../schemas'

@Injectable()
export class WalletRepository extends AbstractRepository<Wallet> {
  protected readonly logger = new Logger(WalletRepository.name)

  constructor(@InjectModel(Wallet.name) model, @InjectConnection() connection: Connection) {
    super(model, connection)
  }
}
