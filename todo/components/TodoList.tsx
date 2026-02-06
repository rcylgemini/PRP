'use client';

import type { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  overdue: Todo[];
  pending: Todo[];
  completed: Todo[];
  onTodoUpdated: () => void;
  onTodoDeleted: () => void;
}

export default function TodoList({
  overdue,
  pending,
  completed,
  onTodoUpdated,
  onTodoDeleted,
}: TodoListProps) {
  return (
    <div className="space-y-8">
      {/* Overdue Section */}
      {overdue.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-2xl font-bold text-red-600">
              Overdue ({overdue.length})
            </h2>
          </div>
          <div className="space-y-3">
            {overdue.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isOverdue={true}
                onUpdated={onTodoUpdated}
                onDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pending Section */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pending ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isOverdue={false}
                onUpdated={onTodoUpdated}
                onDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed Section */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Completed ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isOverdue={false}
                onUpdated={onTodoUpdated}
                onDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {overdue.length === 0 && pending.length === 0 && completed.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No todos yet. Create one above to get started!</p>
        </div>
      )}
    </div>
  );
}
