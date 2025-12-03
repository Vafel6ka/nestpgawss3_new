import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../prisma';

@Injectable()
export class UserService {
  // Тепер prisma підключаємо напряму
  constructor(private prismaService: PrismaService) {
  }

  async createUsers(data: Prisma.UserCreateInput) {
    const user = await this.prismaService.client.user.create({ data: {
      ...data,
      userSetting: {
        create: {
          smsEnabled: true,
          notificationsOn: false,
        },
      },
    }, });
    return user; // повертаємо створений запис
  }


  async getUsers() {
    // отримуємо всіх користувачів
    const users = await this.prismaService.client.user.findMany({
      // select: { id: true, username: true, displayName: true },
      //include:{userSetting: true} // all user seettings cols
      include: { //only notif, sms cols
        userSetting: {
          select: {
            notificationsOn: true,
            smsEnabled: true
          }
        },
        posts: true //will show all posts data is table
      },

    });
  
    return users;
  }

  getUserById(id: number) {
    return this.prismaService.client.user.findUnique({
      where: { id },
      // select: {
      //   id: true,
      //   username: true,
      //   displayName: true,
      // },
      include: {
        userSetting: {
          select: {
            id: true,
            notificationsOn: true,
            smsEnabled: true
          }
        }
      }
    });
  }

  async updateUserById(id: number, data: Prisma.UserUpdateInput) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new HttpException('User Not Found', 404);

    if (data.username) {
      const findUser = await this.prismaService.client.user.findUnique({
        where: { username: data.username as string },
      });
      if (findUser) throw new HttpException('Username already taken', 400);
    }
    return this.prismaService.client.user.update({ where: { id }, data });
  }

  async updateUserSettings(
    userId: number,
    data: Prisma.UserSettingUpdateInput,
  ) {
    const findUser = await this.getUserById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    if (!findUser.userSetting) throw new HttpException('No Settings', 400);
    return this.prismaService.client.userSetting.update({ where: { userId }, data });
  }

  async deleteUserById(id: number) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new HttpException('User Not Found', 404);
    return this.prismaService.client.user.delete({ where: { id } });
  }
  
}