'use client';

import { useEffect, useState } from 'react';
import type { Todo } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

interface TodosData {
  todos: Todo[];
  overdue: Todo[];
  pending: Todo[];
  completed: Todo[];
}

export default function Home() {
  const [todosData, setTodosData] = useState<TodosData>({
    todos: [],
    overdue: [],
    pending: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodosData(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTodoCreated = () => {
    fetchTodos();
  };

  const handleTodoUpdated = () => {
    fetchTodos();
  };

  const handleTodoDeleted = () => {
    fetchTodos();
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Todo App</h1>
          <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
        </header>

        <TodoForm onTodoCreated={handleTodoCreated} />

        <div className="mt-12">
          <TodoList
            overdue={todosData.overdue}
            pending={todosData.pending}
            completed={todosData.completed}
            onTodoUpdated={handleTodoUpdated}
            onTodoDeleted={handleTodoDeleted}
          />
        </div>

        {/* Summary Stats */}
        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-red-600">
              {todosData.overdue.length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {todosData.pending.length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              {todosData.completed.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>
    </main>
  );
}
