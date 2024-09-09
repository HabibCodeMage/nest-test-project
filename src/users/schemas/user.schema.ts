import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/entities/book.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop({ type: Number, required: true })
  age: number;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: [String], required: true })
  roles: string[];
  @Prop({ type: [Book], default: [] })
  books: Book[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// may use bcrypt
// Add pre-save hook with typed `this`
UserSchema.pre<UserDocument>('save', function (next) {
  if (this.age < 0) {
    next(new Error('Age cannot be negative'));
  } else {
    next(); // Proceed with the save operation
  }
});
