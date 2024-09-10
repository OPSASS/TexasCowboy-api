import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { RankingController } from './controllers'
import { RankingRepository } from './repositories'
import { Ranking, RankingSchema } from './schemas'
import { RankingService } from './services'

@Module({
  imports: [MongooseModule.forFeature([{ name: Ranking.name, schema: RankingSchema }]), forwardRef(() => AuthModule)],
  controllers: [RankingController],
  providers: [RankingService, RankingRepository],
  exports: [RankingService]
})
export class RankingModule {}
