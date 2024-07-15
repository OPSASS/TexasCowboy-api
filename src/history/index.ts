import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { HistoryController } from './controllers'
import { HistoryRepository } from './repositories'
import { History, HistorySchema } from './schemas'
import { HistoryService } from './services'

@Module({
  imports: [MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]), forwardRef(() => AuthModule)],
  controllers: [HistoryController],
  providers: [HistoryService, HistoryRepository],
  exports: [HistoryService]
})
export class HistoryModule {}
