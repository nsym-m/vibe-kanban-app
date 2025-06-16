import { render, screen } from '@testing-library/react'
import { BoardCard } from '../board-card'

const mockBoard = {
  id: '1',
  title: 'Test Board',
  description: 'Test Description',
  columns: [
    {
      tasks: [{ id: '1' }, { id: '2' }]
    },
    {
      tasks: [{ id: '3' }]
    }
  ]
}

const mockBoardWithoutDescription = {
  id: '2',
  title: 'Board Without Description',
  description: null,
  columns: [
    {
      tasks: []
    }
  ]
}

describe('BoardCard', () => {
  it('renders board title', () => {
    render(<BoardCard board={mockBoard} />)
    expect(screen.getByText('Test Board')).toBeInTheDocument()
  })

  it('renders board description when provided', () => {
    render(<BoardCard board={mockBoard} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('does not render description when null', () => {
    render(<BoardCard board={mockBoardWithoutDescription} />)
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })

  it('displays correct column count', () => {
    render(<BoardCard board={mockBoard} />)
    expect(screen.getByText('2 列')).toBeInTheDocument()
  })

  it('displays correct task count', () => {
    render(<BoardCard board={mockBoard} />)
    expect(screen.getByText('3 タスク')).toBeInTheDocument()
  })

  it('displays zero tasks when no tasks exist', () => {
    render(<BoardCard board={mockBoardWithoutDescription} />)
    expect(screen.getByText('0 タスク')).toBeInTheDocument()
  })

  it('renders as a link to board detail page', () => {
    render(<BoardCard board={mockBoard} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/boards/1')
  })

  it('calculates total tasks correctly across multiple columns', () => {
    const boardWithManyTasks = {
      id: '3',
      title: 'Many Tasks Board',
      description: null,
      columns: [
        { tasks: [{ id: '1' }, { id: '2' }, { id: '3' }] },
        { tasks: [{ id: '4' }, { id: '5' }] },
        { tasks: [] },
        { tasks: [{ id: '6' }] }
      ]
    }
    
    render(<BoardCard board={boardWithManyTasks} />)
    expect(screen.getByText('6 タスク')).toBeInTheDocument()
    expect(screen.getByText('4 列')).toBeInTheDocument()
  })
})