import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { UsersModule } from 'src/users'
import { WalletModule } from 'src/wallet'
import { VNPayController } from './controllers'
import { VNPayRepository } from './repositories'
import { VNPay, VNPaySchema } from './schemas'
import { VNPayService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VNPay.name, schema: VNPaySchema }]),
    forwardRef(() => AuthModule),
    UsersModule,
    WalletModule
  ],
  controllers: [VNPayController],
  providers: [VNPayService, VNPayRepository]
})
export class VNPayModule {}
