/**
 * @jest-environment node
 */

import { createBoard, createTask } from '../actions'
import { prisma } from '../prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

type MockBoard = {
  id: string
  title: string
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}

type MockTask = {
  id: string
  title: string
  description?: string | null
  position?: number
  priority?: string
  dueDate?: Date | null
  isCompleted?: boolean
  columnId?: string
  createdAt?: Date
  updatedAt?: Date
}

jest.mock('../prisma', () => ({
  prisma: {
    board: {
      create: jest.fn(),
    },
    task: {
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createBoard', () => {
    it('creates a board with title and description', async () => {
      const mockBoard = { id: '1', title: 'Test Board' }
      mockPrisma.board.create.mockResolvedValue(mockBoard as MockBoard)
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      const formData = new FormData()
      formData.append('title', 'Test Board')
      formData.append('description', 'Test Description')

      await expect(createBoard(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockPrisma.board.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Board',
          description: 'Test Description',
          columns: {
            create: [
              {
                title: 'To Do',
                position: 0,
                color: '#ef4444',
              },
              {
                title: 'In Progress',
                position: 1,
                color: '#f59e0b',
              },
              {
                title: 'Done',
                position: 2,
                color: '#10b981',
              },
            ],
          },
        },
      })

      expect(mockRedirect).toHaveBeenCalledWith('/boards/1')
    })

    it('creates a board without description when not provided', async () => {
      const mockBoard = { id: '2', title: 'Board Without Description' }
      mockPrisma.board.create.mockResolvedValue(mockBoard as MockBoard)
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      const formData = new FormData()
      formData.append('title', 'Board Without Description')

      await expect(createBoard(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockPrisma.board.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Board Without Description',
            description: null,
          }),
        })
      )
    })

    it('throws error when title is missing', async () => {
      const formData = new FormData()

      await expect(createBoard(formData)).rejects.toThrow('タイトルは必須です')
    })

    it('handles database errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockPrisma.board.create.mockRejectedValue(new Error('Database error'))

      const formData = new FormData()
      formData.append('title', 'Test Board')

      await expect(createBoard(formData)).rejects.toThrow('ボードの作成に失敗しました')
      consoleSpy.mockRestore()
    })
  })

  describe('createTask', () => {
    it('creates a task with all fields', async () => {
      mockPrisma.task.count.mockResolvedValue(2)
      const mockTask: MockTask = {
        id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        position: 2,
        priority: 'HIGH',
        dueDate: new Date('2024-12-31'),
        isCompleted: false,
        columnId: 'column-1'
      }
      mockPrisma.task.create.mockResolvedValue(mockTask)

      const formData = new FormData()
      formData.append('title', 'Test Task')
      formData.append('description', 'Test Description')
      formData.append('priority', 'HIGH')
      formData.append('dueDate', '2024-12-31')
      formData.append('columnId', 'column-1')
      formData.append('boardId', 'board-1')

      await createTask(formData)

      expect(mockPrisma.task.count).toHaveBeenCalledWith({
        where: { columnId: 'column-1' },
      })

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          priority: 'HIGH',
          dueDate: new Date('2024-12-31'),
          columnId: 'column-1',
          position: 2,
        },
      })

      expect(mockRevalidatePath).toHaveBeenCalledWith('/boards/board-1')
    })

    it('creates a task with minimum required fields', async () => {
      mockPrisma.task.count.mockResolvedValue(0)
      const mockTask: MockTask = {
        id: 'task-2',
        title: 'Minimal Task',
        position: 0,
        priority: 'MEDIUM',
        isCompleted: false,
        columnId: 'column-1'
      }
      mockPrisma.task.create.mockResolvedValue(mockTask)

      const formData = new FormData()
      formData.append('title', 'Minimal Task')
      formData.append('columnId', 'column-1')
      formData.append('boardId', 'board-1')

      await createTask(formData)

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'Minimal Task',
          description: null,
          priority: 'MEDIUM',
          dueDate: null,
          columnId: 'column-1',
          position: 0,
        },
      })
    })

    it('throws error when required fields are missing', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Task')

      await expect(createTask(formData)).rejects.toThrow('必須項目が入力されていません')
    })

    it('throws error when title is missing', async () => {
      const formData = new FormData()
      formData.append('columnId', 'column-1')
      formData.append('boardId', 'board-1')

      await expect(createTask(formData)).rejects.toThrow('必須項目が入力されていません')
    })

    it('handles database errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockPrisma.task.count.mockRejectedValue(new Error('Database error'))

      const formData = new FormData()
      formData.append('title', 'Test Task')
      formData.append('columnId', 'column-1')
      formData.append('boardId', 'board-1')

      await expect(createTask(formData)).rejects.toThrow('タスクの作成に失敗しました')
      consoleSpy.mockRestore()
    })
  })
})