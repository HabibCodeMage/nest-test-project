import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { User } from 'src/users/schemas/user.schema';
import { Types } from 'mongoose';

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('books-by-name/:name')
  findBooksByName(@Param('name') name: string) {
    return this.booksService.findByName(name);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('rating')
  findByRating() {
    return this.booksService.findByRating();
  }

  @Get('price')
  findByPrice() {
    return this.booksService.findByPrice();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Post('lend-book/:bookId')
  lendABook(
    @Param('bookId') bookId,
    @Request()
    req: {
      user: User & {
        _id: Types.ObjectId;
      };
    },
  ) {
    return this.booksService.lend(bookId, req.user);
  }
}
