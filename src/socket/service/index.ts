import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody, OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: true})

export class SocketGetWay implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    // private readonly notificationService: NotificationService
    private logger: Logger = new Logger('MessageGateway');

    constructor(
    ) {}

    async handleConnection(client: Socket) {
        this.logger.log(client.id, 'Connected');
    }

    @SubscribeMessage('notification')
    async listenForMessages(
        @MessageBody() payload: { id: string, status: 'read' | 'unread' },
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const { id, status } = payload;
        // await this.notificationService.update(id, { status: status });
    }
}