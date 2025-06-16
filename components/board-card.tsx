import Link from "next/link";

interface BoardCardProps {
  board: {
    id: string;
    title: string;
    description: string | null;
    columns: {
      tasks: unknown[];
    }[];
  };
}

export function BoardCard({ board }: BoardCardProps) {
  const totalTasks = board.columns.reduce((total, column) => total + column.tasks.length, 0);

  return (
    <Link
      href={`/boards/${board.id}`}
      className="block p-6 bg-card border rounded-lg hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{board.title}</h2>
      {board.description && (
        <p className="text-muted-foreground mb-4 line-clamp-2">{board.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{board.columns.length} 列</span>
        <span>{totalTasks} タスク</span>
      </div>
    </Link>
  );
}