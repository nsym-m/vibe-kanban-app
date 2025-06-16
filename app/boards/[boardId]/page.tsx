import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KanbanColumn } from "@/components/kanban-column";

interface BoardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

async function getBoard(boardId: string) {
  try {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        columns: {
          orderBy: {
            position: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    return board;
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return null;
  }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  const board = await getBoard(boardId);

  if (!board) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{board.title}</h1>
        {board.description && (
          <p className="text-muted-foreground">{board.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {board.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} boardId={board.id} />
        ))}
      </div>
    </div>
  );
}