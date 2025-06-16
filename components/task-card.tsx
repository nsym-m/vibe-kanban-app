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

  return (
    <div className="bg-background border rounded-lg p-3 shadow-sm">
      <h3 className="font-medium mb-1">{task.title}</h3>
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
          <span className="text-muted-foreground">
            {new Date(task.dueDate).toLocaleDateString("ja-JP")}
          </span>
        )}
      </div>
    </div>
  );
}