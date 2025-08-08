// _repositories/Post.ts
import { prisma } from "@/utils/prismaSingleton";
import { Post as PrismaPost } from "@prisma/client";

export type Post = PrismaPost & {
  user?: {
    supabaseId: any;
    name: string | null;
  };
};

export type CreatePostParams = {
  title: string;
  content: string;
  userId: number;
};

export namespace PostRepository {
  export async function findMany(): Promise<Post[]> {
    return await prisma.post.findMany({
      include: {
        user: {
          select: {
            supabaseId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  export async function create(params: CreatePostParams) {
    const { title, content, userId } = params;
    return await prisma.post.create({
      data: { title, content, userId },
    });
  }

  export async function findById(id: number): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            supabaseId: true, //ここでスパベースIDを呼んでいる
            name: true,
          },
        },
      },
    });
  }

  export async function update(
    id: number,
    data: { title: string; content: string }
  ) {
    return await prisma.post.update({
      where: { id },
      data,
    });
  }

  export const deletePostById = async (id: number) => {
    return await prisma.post.delete({
      where: { id },
    });
  };
}
