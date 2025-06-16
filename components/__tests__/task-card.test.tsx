import { render, screen } from '@testing-library/react'
import { TaskCard } from '../task-card'

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'HIGH' as const,
  dueDate: new Date('2024-12-31')
}

const mockTaskWithoutDescription = {
  id: '2',
  title: 'Task Without Description',
  description: null,
  priority: 'LOW' as const,
  dueDate: null
}

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders task description when provided', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('does not render description when null', () => {
    render(<TaskCard task={mockTaskWithoutDescription} />)
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('applies correct priority color class', () => {
    render(<TaskCard task={mockTask} />)
    const priorityBadge = screen.getByText('HIGH')
    expect(priorityBadge).toHaveClass('bg-orange-500')
  })

  it('renders due date when provided', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('2024/12/31')).toBeInTheDocument()
  })

  it('does not render due date when null', () => {
    render(<TaskCard task={mockTaskWithoutDescription} />)
    expect(screen.queryByText(/2024/)).not.toBeInTheDocument()
  })

  describe('priority colors', () => {
    it('applies correct color for LOW priority', () => {
      const lowPriorityTask = { ...mockTask, priority: 'LOW' as const }
      render(<TaskCard task={lowPriorityTask} />)
      const priorityBadge = screen.getByText('LOW')
      expect(priorityBadge).toHaveClass('bg-gray-500')
    })

    it('applies correct color for MEDIUM priority', () => {
      const mediumPriorityTask = { ...mockTask, priority: 'MEDIUM' as const }
      render(<TaskCard task={mediumPriorityTask} />)
      const priorityBadge = screen.getByText('MEDIUM')
      expect(priorityBadge).toHaveClass('bg-blue-500')
    })

    it('applies correct color for HIGH priority', () => {
      const highPriorityTask = { ...mockTask, priority: 'HIGH' as const }
      render(<TaskCard task={highPriorityTask} />)
      const priorityBadge = screen.getByText('HIGH')
      expect(priorityBadge).toHaveClass('bg-orange-500')
    })

    it('applies correct color for URGENT priority', () => {
      const urgentPriorityTask = { ...mockTask, priority: 'URGENT' as const }
      render(<TaskCard task={urgentPriorityTask} />)
      const priorityBadge = screen.getByText('URGENT')
      expect(priorityBadge).toHaveClass('bg-red-500')
    })
  })

  it('formats date correctly for Japanese locale', () => {
    const taskWithDate = {
      ...mockTask,
      dueDate: new Date('2024-01-15')
    }
    render(<TaskCard task={taskWithDate} />)
    expect(screen.getByText('2024/1/15')).toBeInTheDocument()
  })
})