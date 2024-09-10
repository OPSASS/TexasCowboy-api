import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth'
import { HistoryModule } from './history'
import { PokerModule } from './poker'
import { RankingModule } from './ranking'
import { SocketModule } from './socket'
import { TransactionModule } from './transactions'
import { UsersModule } from './users'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    PokerModule,
    HistoryModule,
    TransactionModule,
    RankingModule,
    AuthModule,
    SocketModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*')
  }
}
