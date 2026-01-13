import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
            participants: new Types.ObjectId(userId) as any,
        }).exec();

        if (!room) {
            room = new this.roomModel({
                type: 'oracle',
                participants: [new Types.ObjectId(userId)],
                name: 'MysticaAI',
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
            senderId: new Types.ObjectId(userId),
            senderType: 'user',
            content: content,
        });
        await userMessage.save();

        // Get chat history for context (last 10 messages)
        const history = await this.messageModel
            .find({ roomId: room._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();

        const historyContext = history
            .reverse()
            .slice(0, -1) // Exclude the message we just saved
            .map(m => `${m.senderType === 'user' ? 'Người dùng' : 'MysticaAI'}: ${m.content}`)
            .join('\n');

        let aiResponseContent: string;

        try {
            // Build prompt with history context
            const prompt = historyContext
                ? `Lịch sử trò chuyện:\n${historyContext}\n\nNgười dùng hỏi MysticaAI: "${content}". Hãy trả lời với phong cách huyền bí, sáng suốt và chân thành. Bạn là MysticaAI - trí tuệ nhân tạo vạn năng của Mystica.`
                : `Người dùng hỏi MysticaAI: "${content}". Hãy trả lời với phong cách huyền bí, sáng suốt và chân thành. Bạn là MysticaAI - trí tuệ nhân tạo vạn năng của Mystica.`;

            aiResponseContent = await this.aiService.generateInterpretation(prompt);
        } catch (error) {
            console.error('AI Error in sendOracleMessage:', error);
            // Return a graceful error message instead of throwing
            aiResponseContent = '🔮 Xin lỗi, năng lượng tâm linh hiện đang bị nhiễu loạn. MysticaAI tạm thời không thể kết nối. Vui lòng thử lại sau giây lát.\n\n⚠️ Nếu lỗi tiếp tục xảy ra, hãy liên hệ quản trị viên.';
        }

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
        return this.messageModel.find({ roomId: new Types.ObjectId(roomId) }).sort({ createdAt: 1 }).exec();
    }

    async resetOracleChat(userId: string) {
        const room = await this.getOracleRoom(userId);
        await this.messageModel.deleteMany({ roomId: room._id });

        // Update room last message
        await this.roomModel.findByIdAndUpdate(room._id, {
            $unset: { lastMessage: 1 }
        });

        return { message: 'Chat history cleared' };
    }
}
