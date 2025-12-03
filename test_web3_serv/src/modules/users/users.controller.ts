import { 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe, 
  NotFoundException, 
  Post, 
  Body, 
  UsePipes, 
  ValidationPipe, 
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdateUserSettingsDto } from './dtos';
import { AuthGuard } from '@nestjs/passport';

//@UseGuards(AuthGuard('jwt')) // захищає всі запити контроллера
@Controller('users') // Вказує базовий шлях для цього контролера: /users
export class UserController {
  constructor(private userService: UserService) {} // Інжекція сервісу користувачів

  // POST /users
  @Post()
  @UsePipes(ValidationPipe) // Використовує ValidationPipe для автоматичної валідації DTO
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Викликає метод сервісу для створення нового користувача
    // createUserDto містить дані, що прийшли в тілі запиту
    return await this.userService.createUsers(createUserDto);
  }

  // GET /users
  @Get()
  @UseGuards(AuthGuard('jwt')) // захищає лише цей запит
  async getUsers() {
    // Повертає список усіх користувачів через сервіс
    return this.userService.getUsers();
  }

  // GET /users/:id
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe автоматично конвертує id з рядка в число
    const user = await this.userService.getUserById(id);

    // Якщо користувача з таким id не знайдено, кидаємо NotFoundException
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Повертаємо знайденого користувача
    return user;
  }

  @Patch(':id')
  async updateUserById(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUserById(id, updateUserDto);
  }

  // PATCH users/:id/settings
  @Patch(':id/settings')
  async updateUserSettingsByUserId(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserSettingsDto: UpdateUserSettingsDto,
    ) {
      return await this.userService.updateUserSettings(id, updateUserSettingsDto);
    }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUserById(id);
  }
}
