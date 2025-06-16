"use server";

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createBoard(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    throw new Error("タイトルは必須です");
  }

  try {
    const board = await prisma.board.create({
      data: {
        title,
        description: description || null,
        columns: {
          create: [
            {
              title: "To Do",
              position: 0,
              color: "#ef4444",
            },
            {
              title: "In Progress", 
              position: 1,
              color: "#f59e0b",
            },
            {
              title: "Done",
              position: 2,
              color: "#10b981",
            },
          ],
        },
      },
    });

    redirect(`/boards/${board.id}`);
  } catch (error) {
    console.error("Failed to create board:", error);
    throw new Error("ボードの作成に失敗しました");
  }
}