export interface Task {
    id: string;
    title: string;         // ✅ Short summary (5 words)
    description: string;   // ✅ Full transcript
    completed: boolean;
    createdAt: Date;
    userId: string;
  }
  