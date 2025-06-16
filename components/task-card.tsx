import { getExpiredTaskInfo } from "@/lib/task-utils";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: Date | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColors = {
    LOW: "bg-gray-500",
    MEDIUM: "bg-blue-500", 
    HIGH: "bg-orange-500",
    URGENT: "bg-red-500",
  };

  const expiredInfo = getExpiredTaskInfo(task.dueDate);

  return (
    <div className={`bg-background border rounded-lg p-3 shadow-sm ${
      expiredInfo.isExpired ? 'border-red-500 border-2' : ''
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-medium flex-1">{task.title}</h3>
        {expiredInfo.isExpired && (
          <span className="text-red-500" title="期限切れ">⚠️</span>
        )}
      </div>
      {task.description && (
        <p className="text-sm text-muted-foreground mb-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs">
        <span
          className={`px-2 py-1 rounded-full text-white ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        {task.dueDate && (
          <div className="flex flex-col items-end">
            <span className={expiredInfo.isExpired ? "text-red-500" : "text-muted-foreground"}>
              {new Date(task.dueDate).toLocaleDateString("ja-JP")}
            </span>
            {expiredInfo.isExpired && (
              <span className="text-red-500 text-xs">
                {expiredInfo.relativeText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}