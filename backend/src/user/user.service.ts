import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(data: any): Promise<UserDocument> {
        const createdUser = new this.userModel(data);
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findOne(query: any): Promise<UserDocument | null> {
        return this.userModel.findOne(query).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, data: any): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, { refreshToken }).exec();
    }
}
