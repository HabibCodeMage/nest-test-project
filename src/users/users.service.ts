import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { role, ...rest } = createUserDto;
      const newUser = new this.userModel(rest);
      newUser.roles = [role];
      return (await newUser.save()).toObject();
    } catch (error) {
      throw new HttpException(
        error.message || 'Some thing bad happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.userModel.find({}).lean();
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findOne({ _id: { $eq: id } });
    } catch (error) {
      throw new HttpException(
        error.message || 'Some thing bad happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.updateOne(
        { _id: { $eq: id } },
        updateUserDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Some thing bad happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.userModel.findOneAndDelete({ _id: { $eq: id } });
    } catch (error) {
      throw new HttpException(
        error.message || 'Some thing bad happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserName(userName: string) {
    try {
      const user = await this.userModel.findOne({ name: userName });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Some thing bad happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async totalBooks() {
    try {
      const books = await this.userModel.aggregate([
        { $group: { _id: null, selectedTags: { $addToSet: '$books' } } },
      ]);
      return books;
    } catch (error) {
      throw new HttpException(
        error.message || 'Some thing bad happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
