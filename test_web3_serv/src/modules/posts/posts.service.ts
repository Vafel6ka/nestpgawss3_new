import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../prisma';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {
  }

  async createPost(userId: number, data: Prisma.PostCreateWithoutUserInput) {
    return await this.prismaService.client.post.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // async getGroupPosts() {
  //   return await this.prismaService.client.groupPost.findMany({
  //     include: {
  //       users: {
  //         select: {
  //           user: true,
  //         },
  //       },
  //     },
  //   });
  // }

  // createGroupPost(
  //   userIds: number[],
  //   data: Prisma.GroupPostCreateWithoutUsersInput,
  // ) {
  //   return this.prisma.groupPost.create({
  //     data: {
  //       ...data,
  //       users: {
  //         create: userIds.map((userId) => ({ userId })),
  //       },
  //     },
  //   });
  // }
}