import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private BookModel: Model<Book>,
    private readonly userService: UsersService,
  ) {}
  create(createBookDto: CreateBookDto) {
    try {
      const Book = new this.BookModel(createBookDto);
      return Book.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async findByName(name: string) {
    try {
      return await this.BookModel.find({
        name: { $eq: name },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async findAll() {
    try {
      return await this.BookModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async findOne(id: string) {
    try {
      const book = await this.BookModel.findById(id);
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      const book = await this.findOne(id);
      Object.assign(book, updateBookDto);
      book.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async remove(id: string) {
    try {
      const res = await this.BookModel.deleteOne({ _id: { $eq: id } });
      if (res.deletedCount == 0) throw new NotFoundException('Book not found');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async lend(
    bookId: string,
    user: User & {
      _id: Types.ObjectId;
    },
  ) {
    try {
      const book = await this.findOne(bookId);
      const requestedUser = await this.userService.findOne(user._id.toString());
      requestedUser.books.push(book);
      requestedUser.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async findByRating() {
    try {
      return await this.BookModel.aggregate([{ $sort: { rating: -1 } }]);
    } catch (error) {
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }

  async findByPrice() {
    try {
      return await this.BookModel.aggregate([{ $sort: { price: -1 } }]);
    } catch (error) {
      throw new InternalServerErrorException(
        'Our servers are down but we are keeping them up',
      );
    }
  }
}
