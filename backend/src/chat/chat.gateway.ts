import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @MessageBody() roomId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(roomId);
        console.log(`User ${client.id} joined room ${roomId}`);
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: { roomId: string; content: string; senderId: string },
        @ConnectedSocket() client: Socket,
    ) {
        // In a real app, we'd save the message to DB here
        // For now, we just broadcast
        this.server.to(data.roomId).emit('new_message', {
            content: data.content,
            senderId: data.senderId,
            createdAt: new Date(),
        });
    }
}
