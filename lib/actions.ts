"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  const dueDate = formData.get("dueDate") as string;
  const columnId = formData.get("columnId") as string;
  const boardId = formData.get("boardId") as string;

  if (!title || !columnId || !boardId) {
    throw new Error("必須項目が入力されていません");
  }

  try {
    // 該当カラムの既存タスク数を取得して新しいタスクのpositionを決定
    const taskCount = await prisma.task.count({
      where: { columnId },
    });

    await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        columnId,
        position: taskCount,
      },
    });

    // ページを再検証してデータを更新
    revalidatePath(`/boards/${boardId}`);
  } catch (error) {
    console.error("Failed to create task:", error);
    throw new Error("タスクの作成に失敗しました");
  }
}

export async function createColumn(formData: FormData) {
  const title = formData.get("title") as string;
  const color = formData.get("color") as string;
  const boardId = formData.get("boardId") as string;

  if (!title || !boardId) {
    throw new Error("必須項目が入力されていません");
  }

  try {
    // 該当ボードの既存カラム数を取得して新しいカラムのpositionを決定
    const columnCount = await prisma.column.count({
      where: { boardId },
    });

    await prisma.column.create({
      data: {
        title,
        color: color || "#94a3b8",
        boardId,
        position: columnCount,
      },
    });

    // ページを再検証してデータを更新
    revalidatePath(`/boards/${boardId}`);
  } catch (error) {
    console.error("Failed to create column:", error);
    throw new Error("カラムの作成に失敗しました");
  }
}