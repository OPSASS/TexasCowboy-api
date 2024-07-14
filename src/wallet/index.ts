import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { WalletController } from './controllers'
import { WalletRepository } from './repositories'
import { Wallet, WalletSchema } from './schemas'
import { WalletService } from './services'

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]), forwardRef(() => AuthModule)],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletService]
})
export class WalletModule {}
