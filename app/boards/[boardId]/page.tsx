import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
          <div key={column.id} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: column.color }}
              />
              <h2 className="font-semibold">{column.title}</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-background border rounded-lg p-3 shadow-sm"
                >
                  <h3 className="font-medium mb-1">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        task.priority === "LOW"
                          ? "bg-gray-500"
                          : task.priority === "MEDIUM"
                          ? "bg-blue-500"
                          : task.priority === "HIGH"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString("ja-JP")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {column.tasks.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  タスクがありません
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}