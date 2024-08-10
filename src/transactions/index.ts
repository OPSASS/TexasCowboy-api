import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { UsersModule } from 'src/users'
import { WalletModule } from 'src/wallet'
import { TransactionController } from './controllers'
import { TransactionRepository } from './repositories'
import { Transaction, TransactionSchema } from './schemas'
import { TransactionService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    forwardRef(() => AuthModule),
    UsersModule,
    WalletModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository]
})
export class TransactionModule {}
