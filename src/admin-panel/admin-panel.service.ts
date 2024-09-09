import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminPanelService {
  constructor(private readonly userService: UsersService) {}
  findTotalBooks() {
    const books = this.userService.totalBooks();
    return books;
  }
}
