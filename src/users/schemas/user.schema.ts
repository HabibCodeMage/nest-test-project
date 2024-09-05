import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String })
  name: string;
  @Prop({ type: Number })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
// Add pre-save hook with typed `this`
UserSchema.pre<UserDocument>('save', function (next) {
  if (this.age < 0) {
    next(new Error('Age cannot be negative'));
  } else {
    next(); // Proceed with the save operation
  }
});
