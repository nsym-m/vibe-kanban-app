import { TaskCard } from "./task-card";
import { AddTaskDialog } from "./add-task-dialog";
import { countExpiredTasks } from "@/lib/task-utils";

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
    tasks: {
      id: string;
      title: string;
      description: string | null;
      priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
      dueDate: Date | null;
    }[];
  };
  boardId: string;
}

export function KanbanColumn({ column, boardId }: KanbanColumnProps) {
  const expiredCount = countExpiredTasks(column.tasks);

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <div
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: column.color }}
        />
        <h2 className="font-semibold">{column.title}</h2>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {column.tasks.length}
          </span>
          {expiredCount > 0 && (
            <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-medium" title="期限切れタスク">
              ⚠️ {expiredCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {column.tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            タスクがありません
          </div>
        )}
        
        <AddTaskDialog columnId={column.id} boardId={boardId} />
      </div>
    </div>
  );
}