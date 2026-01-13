import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom, ChatRoomDocument } from './schemas/chat-room.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatRoom.name) private roomModel: Model<ChatRoomDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private aiService: AiService,
    ) { }

    async getOracleRoom(userId: string) {
        let room = await this.roomModel.findOne({
            type: 'oracle',
            participants: userId as any,
        }).exec();

        if (!room) {
            room = new this.roomModel({
                type: 'oracle',
                participants: [userId],
                name: 'Mystica Oracle',
            });
            await room.save();
        }
        return room;
    }

    async sendOracleMessage(userId: string, content: string) {
        const room = await this.getOracleRoom(userId);

        // Save user message
        const userMessage = new this.messageModel({
            roomId: room._id,
            senderId: userId,
            senderType: 'user',
            content: content,
        });
        await userMessage.save();

        // Get AI response
        // TODO: Include history context if needed
        const aiResponseContent = await this.aiService.generateInterpretation(
            `Người dùng hỏi Mystica Oracle: "${content}". Hãy trả lời với phong cách huyền bí, ấm áp và tích cực.`
        );

        const aiMessage = new this.messageModel({
            roomId: room._id,
            senderType: 'ai',
            content: aiResponseContent,
        });
        await aiMessage.save();

        // Update room last message
        await this.roomModel.findByIdAndUpdate(room._id, {
            lastMessage: {
                content: aiResponseContent,
                senderType: 'ai',
                createdAt: new Date(),
            }
        });

        return [userMessage, aiMessage];
    }

    async getMessages(roomId: string) {
        return this.messageModel.find({ roomId }).sort({ createdAt: 1 }).exec();
    }
}
