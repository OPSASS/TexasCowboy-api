import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth'
import { UserController } from './controllers'
import { UserRepository } from './repositories'
import { User, UserSchema } from './schemas'
import { UsersService } from './services'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
