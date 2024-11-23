// pages/api/setQuestionInactive.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const questionsFilePath = path.resolve(process.cwd(), 'data', 'questions.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { questionId } = req.body;

    try {
      // Read existing questions
      const questions = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));

      // Find and update the question's active status
      const question = questions.find((q: any) => q.id === questionId);
      if (question) {
        question.active = false;
      } else {
        return res.status(404).json({ error: "Question not found" });
      }

      // Write the updated questions array back to the file
      fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));
      res.status(200).json({ message: "Question deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating question:", error);
      res.status(500).json({ error: "Failed to deactivate question" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
