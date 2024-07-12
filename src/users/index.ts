import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from './controllers'
import { UserRepository } from './repositories'
import { User, UserSchema } from './schemas'
import { UsersService } from './services'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
