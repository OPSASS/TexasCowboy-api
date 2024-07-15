import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { HistoryModule } from 'src/history'
import { WalletModule } from 'src/wallet'
import { PokerController } from './controllers'
import { PokerRepository } from './repositories'
import { Poker, PokerSchema } from './schemas'
import { PokerService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poker.name, schema: PokerSchema }]),
    forwardRef(() => AuthModule),
    WalletModule,
    HistoryModule
  ],
  controllers: [PokerController],
  providers: [PokerService, PokerRepository],
  exports: [PokerService]
})
export class PokerModule {}
