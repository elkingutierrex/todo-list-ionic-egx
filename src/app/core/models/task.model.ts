export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId?: string;
  isCompleted: boolean;
  createdAt: Date;
  userId: string;
}
