export class CreateUserDto {
  name: string;
  age: number;
  password: string;
  role: 'user' | 'admin';
}
