export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isCompleted: boolean;
  userId: string;
}
