import { Controller, Get } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';

@Controller('admin-panel')
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Get()
  findTotalBooks() {
    return this.adminPanelService.findTotalBooks();
  }
}
