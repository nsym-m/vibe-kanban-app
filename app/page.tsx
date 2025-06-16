import { CreateBoardDialog } from "@/components/create-board-dialog";
import { BoardCard } from "@/components/board-card";
import { prisma } from "@/lib/prisma";

async function getBoards() {
  try {
    const boards = await prisma.board.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
    return boards;
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    return [];
  }
}

export default async function Home() {
  const boards = await getBoards();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">カンバンボード</h1>
        <CreateBoardDialog />
      </div>
      
      {boards.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">まだボードがありません</p>
          <p className="text-sm text-muted-foreground">新規ボード作成ボタンをクリックして、最初のボードを作成しましょう</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}
