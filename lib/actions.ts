"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    // リダイレクトエラーは正常な動作なので再投げする
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Failed to create board:", error);
    throw new Error("ボードの作成に失敗しました");
  }
}