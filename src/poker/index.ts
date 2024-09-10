import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from 'src/auth'
import { HistoryModule } from 'src/history'
import { RankingModule } from 'src/ranking'
import { SocketModule } from 'src/socket'
import { WalletModule } from 'src/wallet'
import { PokerController } from './controllers'
import { PokerRepository } from './repositories'
import { Poker, PokerSchema } from './schemas'
import { PokerService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poker.name, schema: PokerSchema }]),
    ScheduleModule.forRoot(),
    forwardRef(() => AuthModule),
    WalletModule,
    HistoryModule,
    RankingModule,
    SocketModule
  ],
  controllers: [PokerController],
  providers: [PokerService, PokerRepository],
  exports: [PokerService]
})
export class PokerModule {}
