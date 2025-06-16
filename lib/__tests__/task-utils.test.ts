import { getExpiredTaskInfo, countExpiredTasks } from '../task-utils';

describe('task-utils', () => {
  describe('getExpiredTaskInfo', () => {
    it('returns not expired for null dueDate', () => {
      const result = getExpiredTaskInfo(null);
      
      expect(result.isExpired).toBe(false);
      expect(result.daysOverdue).toBe(0);
      expect(result.relativeText).toBe('');
    });

    it('returns not expired for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const result = getExpiredTaskInfo(futureDate);
      
      expect(result.isExpired).toBe(false);
      expect(result.daysOverdue).toBe(0);
      expect(result.relativeText).toBe('');
    });

    it('returns expired for past date (1 day)', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const result = getExpiredTaskInfo(pastDate);
      
      expect(result.isExpired).toBe(true);
      expect(result.daysOverdue).toBe(1);
      expect(result.relativeText).toBe('1日前に期限切れ');
    });

    it('returns expired for past date (multiple days)', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      
      const result = getExpiredTaskInfo(pastDate);
      
      expect(result.isExpired).toBe(true);
      expect(result.daysOverdue).toBe(3);
      expect(result.relativeText).toBe('3日前に期限切れ');
    });

    it('returns not expired for today', () => {
      const today = new Date();
      
      const result = getExpiredTaskInfo(today);
      
      expect(result.isExpired).toBe(false);
      expect(result.daysOverdue).toBe(0);
      expect(result.relativeText).toBe('');
    });
  });

  describe('countExpiredTasks', () => {
    it('returns 0 for empty tasks array', () => {
      const result = countExpiredTasks([]);
      expect(result).toBe(0);
    });

    it('returns 0 when no tasks are expired', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const tasks = [
        { dueDate: futureDate },
        { dueDate: null },
        { dueDate: new Date() }
      ];
      
      const result = countExpiredTasks(tasks);
      expect(result).toBe(0);
    });

    it('returns correct count of expired tasks', () => {
      const pastDate1 = new Date();
      pastDate1.setDate(pastDate1.getDate() - 1);
      
      const pastDate2 = new Date();
      pastDate2.setDate(pastDate2.getDate() - 3);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const tasks = [
        { dueDate: pastDate1 }, // expired
        { dueDate: pastDate2 }, // expired
        { dueDate: futureDate }, // not expired
        { dueDate: null }, // not expired
        { dueDate: new Date() } // not expired (today)
      ];
      
      const result = countExpiredTasks(tasks);
      expect(result).toBe(2);
    });
  });
});