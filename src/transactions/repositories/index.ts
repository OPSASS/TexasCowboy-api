import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { Connection, PaginateModel } from 'mongoose'

import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Transaction } from '../schemas'

@Injectable()
export class TransactionRepository extends AbstractRepository<Transaction> {
  protected readonly logger = new Logger(TransactionRepository.name)

  constructor(
    @InjectModel(Transaction.name) model: PaginateModel<Transaction>,
    @InjectConnection() connection: Connection
  ) {
    super(model, connection)
  }
}
