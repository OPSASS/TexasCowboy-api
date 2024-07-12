import { Module } from '@nestjs/common'
import { SocketGetWay } from './service'

@Module({
  imports: [],
  providers: [SocketGetWay],
  exports: [SocketGetWay]
})
export class SocketModule {}
