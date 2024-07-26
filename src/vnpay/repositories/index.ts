import { AbstractRepository } from '@app/common'
import { Injectable, Logger } from '@nestjs/common'
import { Connection, PaginateModel } from 'mongoose'

import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { VNPay } from '../schemas'

@Injectable()
export class VNPayRepository extends AbstractRepository<VNPay> {
  protected readonly logger = new Logger(VNPayRepository.name)

  constructor(@InjectModel(VNPay.name) model: PaginateModel<VNPay>, @InjectConnection() connection: Connection) {
    super(model, connection)
  }
}
