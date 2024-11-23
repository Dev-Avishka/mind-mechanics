import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Define the type for a Question
interface Question {
  id: number;
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
  active: boolean;
}

const questionsFilePath = path.resolve(process.cwd(), 'data', 'questions.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(questionsFilePath, 'utf-8');
      const questions: Question[] = JSON.parse(data);

      const activeQuestions = questions.filter((q: Question) => q.active);
      res.status(200).json(activeQuestions);
    } catch (error) {
      console.error('Error reading questions file:', error);
      res.status(500).json({ error: 'Failed to load questions' });
    }
  } else if (req.method === 'POST') {
    const { id, active } = req.body;

    try {
      const data = fs.readFileSync(questionsFilePath, 'utf-8');
      const questions: Question[] = JSON.parse(data);

      const updatedQuestions = questions.map((q: Question) =>
        q.id === id ? { ...q, active } : q
      );

      fs.writeFileSync(questionsFilePath, JSON.stringify(updatedQuestions, null, 2));
      res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Failed to update question' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
