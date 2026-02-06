export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: Priority;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  reminder_minutes: number | null;
  last_notification_sent: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  due_date?: string;
  priority?: Priority;
}

export interface UpdateTodoRequest {
  title?: string;
  due_date?: string;
  priority?: Priority;
  completed?: boolean;
}

export interface TodosResponse {
  todos: Todo[];
  overdue: Todo[];
  pending: Todo[];
  completed: Todo[];
}
