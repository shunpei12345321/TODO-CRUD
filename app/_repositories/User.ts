// app/_repositories/User.ts
import { prisma } from "@/utils/prismaSingleton";
import { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;
export type CreateUserParams = {
  name?: string;
  email: string;
  supabaseId: string;
};

export async function findMany(): Promise<User[]> {
  return await prisma.user.findMany({
    orderBy: {
      id: "desc",
    },
  });
}

export async function findUnique(userId: number): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function createUser(params: CreateUserParams): Promise<User> {
  const { name, email, supabaseId } = params;
  return await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, supabaseId },
  });
}

export async function update(
  id: number,
  data: { name: string; email: string }
): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: number): Promise<User> {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function findBySupabaseId(
  supabaseId: string
): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { supabaseId },
  });
}

export async function findManyWithPosts(): Promise<User[]> {
  return await prisma.user.findMany({
    include: {
      posts: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function findUniqueWithPosts(
  userId: number
): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { posts: true },
  });
}

export const UserRepository = {
  findMany,
  findUnique,
  createUser,
  update,
  deleteById,
  findBySupabaseId,
  findManyWithPosts,
  findUniqueWithPosts,
};