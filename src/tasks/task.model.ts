export interface Task {
  id: string;
  title: string;         // ✅ Smart GPT-generated title
  description: string;   // ✅ Full transcript from audio
  completed: boolean;
  createdAt: Date;
  userId: string;

  // ✅ Optional GPT-generated content
  tip?: string;          // 💡 Productivity tip
  quote?: string;        // 🧠 Motivational quote
}
