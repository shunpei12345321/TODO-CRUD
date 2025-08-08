import { prisma } from "@/utils/prismaSingleton";
import { Memo as PrismaMemo, Prisma } from "@prisma/client";

export type Memo = PrismaMemo;

export type CreateMemoParams = {
  title: string;
  items?: string;
  textContent?: string;
  images?: string;
  urls?: string;
  type: string;
  userId: number;
};

export namespace MemoRepository {
  export async function findMany(): Promise<Memo[]> {
    return await prisma.memo.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  export async function findById(id: number): Promise<Memo | null> {
    return await prisma.memo.findUnique({
      where: { id },
    });
  }

  export async function create(params: CreateMemoParams): Promise<Memo> {
    const {
      title,
      items,
      textContent,
      images,
      urls,
      type,
      userId,
    } = params;

    return await prisma.memo.create({
      data: {
        title,
        items,
        textContent,
        images,
        urls,
        type,
        user: {
          connect: {
            id: userId, // 外部キーとして接続
          },
        },
      },
    });
  }

  export async function update(
    id: number,
    data: Partial<Omit<CreateMemoParams, "userId">>
  ): Promise<Memo> {
    return await prisma.memo.update({
      where: { id },
      data,
    });
  }

  export async function deleteById(id: number): Promise<Memo> {
    return await prisma.memo.delete({
      where: { id },
    });
  }
}
