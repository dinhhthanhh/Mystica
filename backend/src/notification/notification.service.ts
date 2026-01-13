import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
    ) { }

    async create(data: Partial<Notification>) {
        const notification = new this.notificationModel(data);
        return notification.save();
    }

    async findAllForUser(userId: string) {
        return this.notificationModel.find({ userId })
            .populate('senderId', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(50)
            .exec();
    }

    async markAsRead(id: string) {
        return this.notificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }

    async markAllAsRead(userId: string) {
        return this.notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    }
}
