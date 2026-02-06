import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSingaporeNow, toSingaporeISO, isValidFutureDate } from '@/lib/timezone';
import type { Todo, UpdateTodoRequest } from '@/types/todo';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/todos/[id] - Get a single todo
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined;

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PUT /api/todos/[id] - Update a todo
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body: UpdateTodoRequest = await request.json();
    const { title, due_date, priority, completed } = body;

    // Check if todo exists
    const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined;
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Validation
    if (title !== undefined && title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title cannot be empty' },
        { status: 400 }
      );
    }

    if (due_date !== undefined && due_date !== null && !isValidFutureDate(due_date)) {
      return NextResponse.json(
        { error: 'Due date must be at least 1 minute in the future' },
        { status: 400 }
      );
    }

    if (priority !== undefined && !['high', 'medium', 'low'].includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title.trim());
    }

    if (due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(due_date || null);
    }

    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }

    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json(existingTodo);
    }

    updates.push('updated_at = ?');
    values.push(toSingaporeISO(getSingaporeNow()));
    values.push(id);

    const stmt = db.prepare(`
      UPDATE todos 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo;

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Check if todo exists
    const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined;
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
