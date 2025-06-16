export interface ExpiredTaskInfo {
  isExpired: boolean;
  daysOverdue: number;
  relativeText: string;
}

export function getExpiredTaskInfo(dueDate: Date | null): ExpiredTaskInfo {
  if (!dueDate) {
    return {
      isExpired: false,
      daysOverdue: 0,
      relativeText: '',
    };
  }

  const now = new Date();
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const timeDiff = nowDateOnly.getTime() - dueDateOnly.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  const isExpired = daysDiff > 0;
  
  let relativeText = '';
  if (isExpired) {
    if (daysDiff === 1) {
      relativeText = '1日前に期限切れ';
    } else {
      relativeText = `${daysDiff}日前に期限切れ`;
    }
  }

  return {
    isExpired,
    daysOverdue: daysDiff > 0 ? daysDiff : 0,
    relativeText,
  };
}

export function countExpiredTasks(tasks: Array<{ dueDate: Date | null }>): number {
  return tasks.filter(task => getExpiredTaskInfo(task.dueDate).isExpired).length;
}