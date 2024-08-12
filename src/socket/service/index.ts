import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Poker } from 'src/poker/schemas'

@WebSocketGateway({ cors: true })
export class SocketGetWay implements OnGatewayConnection {
  @WebSocketServer() server: Server

  constructor() {}
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('pokerGameStart')
  handlePokerGameStart(@MessageBody() payload: Poker, @ConnectedSocket() client: Socket): void {
    this.server.emit('pokerGameStart', payload)
  }

  @SubscribeMessage('pokerGameEnd')
  handlePokerGameEnd(@MessageBody() payload: Poker, @ConnectedSocket() client: Socket): void {
    this.server.emit('pokerGameEnd', payload)
  }

  @SubscribeMessage('historyPokerTurn')
  handleHistoryPoker(@MessageBody() payload: Poker, @ConnectedSocket() client: Socket): void {
    this.server.emit('historyPokerTurn', payload)
  }
}
