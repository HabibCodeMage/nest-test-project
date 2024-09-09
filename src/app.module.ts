import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { BooksModule } from './books/books.module';
import { AdminPanelModule } from './admin-panel/admin-panel.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/test'), UsersModule, AuthModule, RolesModule, BooksModule, AdminPanelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
